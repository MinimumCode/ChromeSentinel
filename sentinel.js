var opentabs = []
var browsedata = []


function LogEvent(id, active, title, url, start, end, status) {
    return {
        id: id,
        active: active,
        title: title,
        url: url,
        start: start,
        end: end,
        status: status
    }

}

function searchViaId(id, arr) {
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i].id === id)
            return arr[i]
    }
}
function removeViaId(id,arr){
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i].id === id)
            arr.splice(i,1)
    }
    
}

document.addEventListener("DOMContentLoaded", function () {
    console.log(' -- Retrieving initial open tabs.')
    chrome.tabs.getAllInWindow(null, function (tabs) {

        for (var i = 0; i < tabs.length; ++i) {
            var event = new LogEvent()
            event.id = tabs[i].id
            event.active = tabs[i].active
            event.title = tabs[i].title
            event.url = tabs[i].url
            event.start = (new Date).getTime()
            event.end = 0
            event.status = "initial"
            opentabs.push(event)
        }
        var host = location.hostname
        browsedata = browsedata.concat(opentabs)
        console.log(opentabs)
    })
})



chrome.tabs.onRemoved.addListener(function (id, info) {
    tabinfo = searchViaId(id, opentabs)
    console.log("Tab " + id + " has been closed.")

    var event = new LogEvent()
    event = searchViaId(id, opentabs)
    event.status = "close"
    event.active = false
    event.end = (new Date).getTime()

    browsedata.push(event)
    removeViaId(id,opentabs)

})

chrome.tabs.onActivated.addListener(function (info) {
    console.log("Active tab has been changed", info)
    chrome.tabs.get(info.tabId, function (tab) {
        
        var event = new LogEvent()
            event.id = tab.id
            event.active = tab.active
            event.title = tab.title
            event.url = tab.url
            event.start = (new Date).getTime()
            event.end = 0
            event.status = changeInfo.status

        browsedata.push(event)
    })

})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log("Detected update")
    chrome.tabs.get(tabId,function(tab){
        var event = new LogEvent()
            event.id = tab.id
            event.active = tab.active
            event.title = tab.title
            event.url = tab.url
            event.start = (new Date).getTime()
            event.end = 0
            event.status = changeInfo.status
        browsedata.push(event)
    }) 
    
})