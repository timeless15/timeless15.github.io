
/*database*/
function initDataBase(){
    if(!localStorage.item || !localStorage.subitem || !localStorage.task){
        var itemJson = [{
            "id":0,
            "name":"默认分类",
            "child":[0]
        },{
            "id": 1,
            "name": "工作",
            "child": [1, 2]
        },{
            "id": 2,
            "name": "生活",
            "child": [3]
        }];
        var subItemJson = [{
            "id":0,
            "pid":0,
            "name":"默认子分类",
            "child":[0]
        },{
            "id": 1,
            "pid": 1,
            "name": "前端",
            "child": [1,2,3]
        },{
            "id": 2,
            "pid": 1,
            "name": "服务端",
            "child": [4]
        },{
            "id": 3,
            "pid": 2,
            "name": "吃饭",
            "child": [],
        }];
        var taskJson = [{
            "id":0,
            "pid":0,
            "finish":false,
            "name": "Task",
            "date":"2015-06-05",
            "text":"This is a task"
        },{
            "id":1,
            "pid":1,
            "finish":true,
            "name": "IFE",
            "date": "2015-05-10",
            "text": "百度ife任务1",
        },{
            "id": 2,
            "pid": 1,
            "finish": false,
            "name": "drools",
            "date": "2015-05-31",
            "text": "研究drools推理引擎",
        },{
            "id": 3,
            "pid": 1,
            "finish": true,
            "name": "Sass",
            "date": "2015-06-31",
            "text": "学习慕课网的视频Sass", 
        },{
            "id": 4,
            "pid": 2,
            "finish": false,
            "name":  "AMD",
            "date": "2015-07-31",
            "text": "学习AMD",        
        }];
    localStorage.item = JSON.stringify(itemJson);
    localStorage.subitem = JSON.stringify(subItemJson);
    localStorage.task = JSON.stringify(taskJson);
    }
}


//新增item/subitem->后台数据库更新->
//新增task->后台数据库更新->
//->渲染整个页面item/subite/task/detail

var allTask = $(".allTask");
var itemUl = $(".item-ul");
var taskList = $(".task-list");
var modal = $(".modal");
var currentItemID = 0;
var currentSubitemID = 0;
var currentTaskID = 0;
var showTaskId = [];
var itemJson,subItemJson,taskJson;
initial();
function initial(){
    initDataBase();
    itemJson = JSON.parse(localStorage.item);
    subItemJson = JSON.parse(localStorage.subitem);
    taskJson = JSON.parse(localStorage.task);
    allTask.innerHTML = taskJson.length;
    for(var i=0,len=itemJson.length;i<len;i++){
        renderItem(itemJson[i].id);
    }
    addClass($(".item-head"),"active")
    renderTaskAll();
    renderContent(taskJson[0].id);
    //默认分类不能删除
    var btns = document.getElementsByClassName("deleteBtn");
    btns[0].parentNode.removeChild(btns[0]);
    btns[0].parentNode.removeChild(btns[0]);//删掉后btns更新
}

/*render function*/
//渲染主分类
function renderItem(itemID){
    var item = queryItemById(itemID);
    var itemLi = document.createElement("li");
    var subItemUl = document.createElement("ul");
    itemLi.setAttribute("itemid",itemID);
    addClass(itemLi,"item-li");
    itemLi.innerHTML = "<div class='item-wrap' onclick=itemClick(this)> <span class='itemName'>" + item.name + "</span> <span class='itemNum'></span><button class='deleteBtn'></button></div>";
    itemUl.appendChild(itemLi);
    itemLi.appendChild(subItemUl);
    addClass(subItemUl,'subitem-ul');
    for(var i=0,len=item.child.length;i<len;i++){
        renderSubitem(item.child[i]);
    }
    updateItemNum(itemID);
}

//渲染子分类
function renderSubitem(subitemID){
    var subitem = querySubitemById(subitemID);
    var parentItemDOM = queryItemDOMById(subitem.pid);
    var subitemUl = parentItemDOM.getElementsByTagName("ul")[0];
    var subitemLi = document.createElement("li");
    subitemUl.appendChild(subitemLi);
    subitemLi.setAttribute("subitemid",subitemID);
    addClass(subitemLi,"subitem-li");
    subitemLi.innerHTML = "<div class='subitem-wrap' onclick=subitemClick(this)><span class='subItemName'>" + subitem.name + "</span><span class='subItemNum'> ("+ subitem.child.length + ")</span><button class='deleteBtn'></button></div>";
}
//渲染task
function renderTask(){
    for(var i=0,len=showTaskId.length;i<len;i++){
        var task = queryTaskById(showTaskId[i]);
        var itemLi = document.createElement("li");
        itemLi.innerHTML = "<div class='task-wrap'><span class='task-time'>" + task.date + "</span><span class='task-name' onclick=taskClick(this) taskid=" + task.id + ">" + task.name + "</span></div>";
        taskList.appendChild(itemLi);
        if(task.finish == true){
            itemLi.getElementsByClassName("task-name")[0].className += " finish";
        }
    }
    
}
//渲染所有的task，
function renderTaskAll(){
    taskList.innerHTML = "";
    showTaskId = [];
    for(var i=0,len=taskJson.length;i<len;i++){
        showTaskId.push(taskJson[i].id);
    }
    sortDate();
    renderTask();
    groupDate();
    var task0Span = queryTaskDOMById(showTaskId[0]);
    addClass(task0Span,"select");
    renderContent(taskJson[0].id);
}
//渲染某一个task的content
function renderContent(taskID){
    var task = queryTaskById(taskID);
    if(task){
        $(".show-content").setAttribute("taskid",taskID);
        $(".content-title").innerHTML = task.name;
        $(".content-date").innerHTML = "任务日期: " + task.date;
        $(".content-text").innerHTML = task.text;
        if(task.finish === true){
            $(".content-manipulate").style.display = "none";
        }else {
            $(".content-manipulate").style.display = "block";
        }
    }
    else { //task为空
        $(".content-title").innerHTML = "任务名称";
        $(".content-date").innerHTML = "任务日期";
        $(".content-text").innerHTML = "任务描述";
    }
}
//渲染modal框中的select
function renderSelectItem(){
    var selectItem = $(".select-item");
    var defaultStr = "<option value ='default' itemid='-1'>新增分类</option>";
    selectItem.innerHTML = defaultStr;
    for(var i=1,len=itemJson.length;i<len;i++){
        var item = itemJson[i];
        selectItem.innerHTML +="<option value=" + item.name + " itemid=" + item.id + ">" + item.name + "</option>";
    }
}
//更新item数目
function updateItemNum(itemID){
    var item = queryItemById(itemID);
    var itemLi = queryItemDOMById(itemID);
    var itemNumSpan = itemLi.getElementsByClassName("itemNum")[0];
    var count = 0;
    for(var i=0,len=item.child.length;i<len;i++){
        count += querySubitemById(item.child[i]).child.length;
    }
    itemNumSpan.innerHTML = " ("+ count +")";
}
//更新subitem数目
function updateSubitemNum(subitemID){
    var subitem = querySubitemById(subitemID);
    var subitemLi = querySubitemDOMById(subitemID);
    var subNumSpan = subitemLi.getElementsByClassName("subItemNum")[0];
    subNumSpan.innerHTML = " ("+ subitem.child.length +")"
}
//获得当前选择的itemLi(包括item和subitem)
function getSelectItem(){
    var itemLiArr = itemUl.getElementsByTagName("li");
    for(var i=0,len=itemLiArr.length;i<len;i++){
        if(hasClass(itemLiArr[i],"select")){
            return itemLiArr[i];
        }
    }
    return itemLiArr[0];//没有选中则返回默认
}
function getSelectSubitem(){
    var current = getSelectItem();
    var subitemID;
    if(current.getAttribute("subitemid")){ //如果选中某个子分类
        subitemID = parseInt(current.getAttribute("subitemid"));
    }
    else { //如果选中父分类 则为加入到第一个子分类
        var item = queryItemById(parseInt(current.getAttribute("itemid")));
        subitemID = item.child[0];
    };
    return subitemID;
}
//获得当前的task
function getSelectTask(){
    var taskSpanArr = taskList.getElementsByClassName("task-name");
    for(var i=0,len = taskSpanArr.length;i<len;i++){
        if(hasClass(taskSpanArr[i],"select")){
            return taskSpanArr[i];
        }
    }
    return taskSpanArr[0];
}

/*click function*/
//item点击事件
function itemClick(e){
    var current = getSelectItem();
    var clickItem = e.parentNode;
    removeClass(current,"select")
    addClass(clickItem,"select");
    if(hasClass($(".item-head"),"active")) {
        removeClass($(".item-head"),"active");
    }
    var itemID = parseInt(clickItem.getAttribute("itemid"));
    var item = queryItemById(itemID);
    var childArr = item.child;
    taskList.innerHTML = "";
    showTaskId = [];
    for(var i=0,len=childArr.length;i<len;i++){
        var subitem = querySubitemById(childArr[i]);
        for(var j=0,sublen=subitem.child.length;j<sublen;j++){
            showTaskId.push(subitem.child[j])
        }
    }
    sortDate();
    renderTask();
    groupDate();
    //显示第一个子分类第一个task的内容
    var task0ID = querySubitemById(childArr[0]).child[0];
    var task0Span = queryTaskDOMById(task0ID);
    addClass(task0Span,"select");
    renderContent(task0ID);
    addClass($(".task-filter .all"),"select");
    removeClass($(".task-filter .finish"),"select");
    removeClass($(".task-filter .unfinish"),"select");
}
//subitem点击事件
function subitemClick(e){
    var current = getSelectItem();
    var clickSubitem = e.parentNode;
    removeClass(current,"select");
    addClass(clickSubitem,"select");
    if(hasClass($(".item-head"),"active")) removeClass($(".item-head"),"active");
    var subitemID = parseInt(clickSubitem.getAttribute("subitemid"));
    var subitem = querySubitemById(subitemID);
    taskList.innerHTML = "";
    showTaskId = [];
    for (var i=0,len=subitem.child.length;i<len;i++){
        showTaskId.push(subitem.child[i]);
    }
    sortDate();
    renderTask();
    groupDate();
    //显示第一个task的内容,没有则显示空
    if(subitem.child.length>0){
        var task0ID = subitem.child[0];
        var task0Span = queryTaskDOMById(task0ID);
        addClass(task0Span,"select");
        renderContent(task0ID);
    }
    addClass($(".task-filter .all"),"select");
    removeClass($(".task-filter .finish"),"select");
    removeClass($(".task-filter .unfinish"),"select");
}

function taskClick(e){
    var current = getSelectTask();
    removeClass(current,"select");
    addClass(e,"select");
    var taskID = parseInt(e.getAttribute("taskid"));
    renderContent(taskID);
}

$(".item-head").addEventListener("click",function(e){
    renderTaskAll();
    removeClass(getSelectItem(),"select")
    addClass(this,"active");
});
$(".add-item").addEventListener("click",function(e){
    e.preventDefault();
    modal.style.display = "block";
    $("input.in-itemname").value = "";
    renderSelectItem();
});

$(".confirm-item").addEventListener("click",function(e){
    e.preventDefault();
    var selectedID = parseInt($(".select-item").selectedOptions[0].getAttribute("itemid"));
    var inputValue = $("input.in-itemname").value;
    if(selectedID == -1){ //增加主分类
        var itemAdd = {
            "id":itemJson[itemJson.length-1].id+1,
            "name":inputValue,
            "child":[]
        };
        itemJson.push(itemAdd);
        renderItem(itemAdd.id);
    }else{//增加subitem
        var subitemAdd = {
            "id":subItemJson[subItemJson.length-1].id+1,
            "pid":selectedID,
            "name":inputValue,
            "child":[]
        };
        subItemJson.push(subitemAdd);
        var parentItem = queryItemById(selectedID);
        parentItem.child.push(subitemAdd.id);
        renderSubitem(subitemAdd.id);
    }
    localStorage.item = JSON.stringify(itemJson);
    localStorage.subitem = JSON.stringify(subItemJson);
    modal.style.display = "none";
});

$(".cancel-item").addEventListener("click",function(e){
    e.preventDefault();
    $("input.in-itemname").value = "";
    modal.style.display = "none";
});

$(".add-task").addEventListener("click",function(e){
    e.preventDefault();
    $(".show-content").style.display = "none";
    $(".add-content").style.display = "block";
});

$(".save-task").addEventListener("click",function(e){
    e.preventDefault();
    var subitemID,taskID ;
    //判断是编辑还是增加任务
    if($(".add-content").getAttribute("edit")=="true"){
        taskID = parseInt($(".show-content").getAttribute("taskid"));
        var task = queryTaskById(taskID);
        task.name = $("input.in-taskname").value;
        task.date = $("input.in-taskdate").value;
        task.text = $("textarea.in-tasktext").value;
        taskList.innerHTML = "";
        sortDate();
        renderTask();
        groupDate();
    }else{
        //先判断加入到哪个子分类
        subitemID = getSelectSubitem();
        taskID = taskJson[taskJson.length-1].id+1;
        var taskAdd = {
            "id":taskID,
            "pid": subitemID,
            "finish":false,
            "name":$("input.in-taskname").value,
            "date":$("input.in-taskdate").value,
            "text":$("textarea.in-tasktext").value
        };
        //数据库更新
        var subitem = querySubitemById(subitemID);
        taskJson.push(taskAdd);
        subitem.child.push(taskID);
        //显示数目更新(顺序)
        updateSubitemNum(subitemID);
        updateItemNum(subitem.pid);
        allTask.innerHTML = taskJson.length;
        //中间栏task列表更新
        taskList.innerHTML = "";
        showTaskId.push(taskID);
        sortDate();
        renderTask();
        groupDate();
        removeClass(getSelectTask(),"select");
        addClass(queryTaskDOMById(taskID),"select");
    }   
    //显示的task内容更新;
    $(".show-content").style.display = "block";
    $(".add-content").style.display = "none";
    $(".add-content").setAttribute("edit","false");
    renderContent(taskID);
    $("input.in-taskname").value="";
    $("input.in-taskdate").value="";
    $("textarea.in-tasktext").value="";
    localStorage.item = JSON.stringify(itemJson);
    localStorage.subitem = JSON.stringify(subItemJson);
    localStorage.task = JSON.stringify(taskJson);
});

$(".cancel-task").addEventListener("click",function(e){
    $(".show-content").style.display = "block";
    $(".add-content").style.display = "none";
    $(".add-content").setAttribute("edit","false");
    $("input.in-taskname").value="";
    $("input.in-taskdate").value="";
    $("textarea.in-tasktext").value="";
});

/*delete function*/
eventDelegate(itemUl,"button","click",function(e){
    var r = confirm("确定删除该分类吗？");
    if(r == true){
        var deleteItem = e.target.parentNode.parentNode;
        if(hasClass(deleteItem,"subitem-li")){
            var subitemID = parseInt(deleteItem.getAttribute("subitemid"));
            var subitem = querySubitemById(subitemID);
            var itemID = subitem.pid
            var childs = queryItemById(itemID).child;
            var subchilds = subitem.child;
            //更新数据库
            for(var i=0,len=subchilds.length;i<len;i++){
                arrayDelete(subchilds[i],taskJson);
            }//删除task
            childs.splice(childs.indexOf(subitemID),1);//删除父item的child
            arrayDelete(subitemID,subItemJson);
            updateItemNum(itemID);
        }
        if(hasClass(deleteItem,"item-li")){
            var itemID = parseInt(deleteItem.getAttribute("itemid"));
            var item = queryItemById(itemID);
            var childs = item.child //subitem
            //更新数据库
            for(var i=0,len=childs.length;i<len;i++){
                var subitem = querySubitemById(childs[i]);
                var subchilds = subitem.child;
                for(var j=0,len=subchilds.length;i<len;i++){
                    arrayDelete(subchilds[j],taskJson);
                }
                arrayDelete(subitem.id,subItemJson);
            }
            arrayDelete(itemID,itemJson);
            
        }
        deleteItem.parentNode.removeChild(deleteItem);
        allTask.innerHTML = taskJson.length;
        renderTaskAll();
        localStorage.item = JSON.stringify(itemJson);
        localStorage.subitem = JSON.stringify(subItemJson);
        localStorage.task = JSON.stringify(taskJson);
    }
})

/*edit or finish*/
eventDelegate($(".show-content"),"button","click",function(e){
    var btn = e.target;
    var taskid = parseInt(btn.parentNode.parentNode.getAttribute("taskid"));
    var task = queryTaskById(taskid);
    //edit
    if(hasClass(btn,"content-edit")){ 
        $(".show-content").style.display = "none";
        $(".add-content").style.display = "block";
        $(".add-content").setAttribute("edit","true");
        $("input.in-taskname").value = task.name;
        $("input.in-taskdate").value = task.date;
        $("textarea.in-tasktext").value = task.text;
    };
    //mark as finish;
    if(hasClass(btn,"content-finish")){
        var r = confirm("确定要将该任务标记为完成吗？")
        if(r==true){
            task.finish = true;
            addClass(queryTaskDOMById(taskid),"finish");
            renderContent(taskid);
        } 
    };
    localStorage.task = JSON.stringify(taskJson);
})
function getSelectFilter(){
    var filterLi = $(".task-filter").getElementsByTagName("li");
    for(var i=0,len=filterLi.length;i<len;i++){
        if(hasClass(filterLi[i]),"select") return filterLi[i];
    }
}
/*finish filter*/
eventDelegate($(".task-filter"),"li","click",function(){
    var tag = this.className;
    removeClass($(".task-filter .all"),"select");
    removeClass($(".task-filter .finish"),"select");
    removeClass($(".task-filter .unfinish"),"select");
    addClass(this,"select");
    taskList.innerHTML = "";
    var currentTaskListAll = [];
    //在filter前获得当前分类下所有的taskID
    if(hasClass($(".item-head"),"active")) {
        for(var i=0,len=taskJson.length;i<len;i++){
            currentTaskListAll.push(taskJson[i].id);
        }
    }else{
        var current = getSelectItem();
        if(hasClass(current,"item-li")){
            var item = queryItemById(parseInt(current.getAttribute("itemid")));
            for(var i=0,len=item.child.length;i<len;i++){
                var subitem = querySubitemById(item.child[i]);
                for(var j=0,sublen=subitem.child.length;j<sublen;j++){
                    currentTaskListAll.push(subitem.child[j]);
                }
            }
        }else if(hasClass(current,"subitem-li")){
            var subitem = querySubitemById(parseInt(current.getAttribute("subitemid")));
            currentTaskListAll = subitem.child;
        }
    }
    showTaskId = [];
    showTaskId = taskFilter(currentTaskListAll,tag);
    sortDate();
    renderTask();
    groupDate();
})

function taskFilter(currentTaskList,tag){
    if(tag=="all") return currentTaskList;

    var finishArr = [];
    var unfinishArr = [];//返回要渲染的tasklist的id
    for(var i=0,len=currentTaskList.length;i<len;i++){
        var task = queryTaskById(currentTaskList[i]);
        if(task.finish == true) finishArr.push(currentTaskList[i]);
        else unfinishArr.push(currentTaskList[i]);
    }
    if(tag=="finish") return finishArr;
    if(tag=="unfinish") return unfinishArr;
}
/*sort by date*/
function sortDate(){
    var temptask = [];
    for(var i=0,len=showTaskId.length;i<len;i++){
        temptask.push(queryTaskById(showTaskId[i]));
    }
    temptask.sort(function(a,b){
        var c = a.date.split("-");
        var d = b.date.split("-");
        if(parseInt(c[0])>parseInt(d[0])) return -1;
        else if(parseInt(c[0])<parseInt(d[0])) return 1;
        else if(parseInt(c[1])>parseInt(d[1])) return -1;
        else if(parseInt(c[1])<parseInt(d[1])) return 1;
        else if(parseInt(c[2])>parseInt(d[2])) return -1;
        else if(parseInt(c[2])<parseInt(d[2])) return 1;
        else return 0;
    });
    showTaskId = [];
    for(var i=0,len=temptask.length;i<len;i++){
        showTaskId.push(temptask[i].id);
    }
}
function groupDate(){
    var temptask = [];
    for(var i=0,len=showTaskId.length;i<len;i++){
        temptask.push(queryTaskById(showTaskId[i]));
    }
    for(var i=0,len=temptask.length-1;i<len;i++){
        var now = temptask[i].date;
        var next= temptask[i+1].date;
        if(now==next) {
            var taskTimeSpan = queryTaskDOMById(temptask[i+1].id).previousSibling;
            taskTimeSpan.parentNode.removeChild(taskTimeSpan);
        }
    }
}
//Common Function
function queryItemById(itemID){
    for(var i=0,len = itemJson.length;i<len;i++){
        if(itemJson[i].id === itemID) {
            return itemJson[i];
        }
    }
}
function queryItemDOMById(itemID){
    var itemLis = document.getElementsByClassName("item-li");
    for(var i=0,len=itemLis.length;i<len;i++){
        if(parseInt(itemLis[i].getAttribute("itemid"))===itemID){
            return itemLis[i];
        }
    }
}
function querySubitemById(subitemID){
    for(var i=0,len = subItemJson.length;i<len;i++){
        if(subItemJson[i].id === subitemID) {
            return subItemJson[i];
        }
    }
}
function querySubitemDOMById(subitemID){
    var subitemLis = document.getElementsByClassName("subitem-li");
    for(var i=0,len=subitemLis.length;i<len;i++){
        if(parseInt(subitemLis[i].getAttribute("subitemid"))===subitemID){
            return subitemLis[i];
        }
    }
}

function queryTaskById(taskID){
    for(var i=0,len=taskJson.length;i<len;i++){
        if(taskJson[i].id === taskID){
            return taskJson[i];
        }
    }
}
function queryTaskDOMById(taskID){
    var taskSpans = taskList.getElementsByClassName("task-name");
    for(var i=0,len=taskSpans.length;i<len;i++){
        if(parseInt(taskSpans[i].getAttribute("taskid")) === taskID){
            return taskSpans[i];
        }
    }
}
function arrayDelete(id,array){
    var index = 0;
    for(var i=0,len=array.length;i<len;i++){
        if(array[i].id === id) {
            index = i;
            break;
        }
    }
    return array.splice(index,1);
}
