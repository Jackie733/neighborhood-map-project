//定义全局变量
var map;
var markers = [];
// var infoWindow;

//景点信息
var placesList = [
    {
        name: '天安门',
        location: {lat: 39.9087158, lng: 116.3974857}
    },
    {
        name: '天坛',
        location: {lat: 39.8836928, lng: 116.4073963}
    },
    {
        name: '首都博物馆',
        location: {lat: 39.9064443, lng: 116.3419533}
    },
    {
        name: '地坛',
        location: {lat: 39.9528459, lng: 116.416111}
    },
    {
        name: '圆明园',
        location: {lat: 40.0080918, lng: 116.2982225}
    },
    {
        name: '首都图书馆',
        location: {lat: 39.8690369, lng: 116.4636183}
    }
];


//初始化地图信息
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.9087158, lng: 116.3974857},
        zoom: 12,
        mapTypeControl: false,

    });

    
    ko.applyBindings(new ViewModel());
}


//位置对象构造函数
var Places = function(data) {
    this.name = ko.observable(data.name);
    this.mapError = ko.observable('')
};

//定义konckout ViewModel
var ViewModel = function() {
    var self = this;
    self.locations = ko.observableArray();
    self.filter = ko.observableArray(self.locations());
    self.locationInput = ko.observable('');
    self.errorMessage = ko.observable('');
    self.temp = ko.observable('');

    //信息窗口
    var largeInfowindow = new google.maps.InfoWindow();

    //列表
    placesList.forEach(function(data) {
        var location = new Places(data);
        var position = placesList.location;
        var title = placesList.name;

        //标记信息
        var marker = new google.maps.Marker({
            position: data.location,
            map: map,
            title: data.name,
            animation: google.maps.Animation.DROP
        });

        //标记信息添加点击动作监听
        marker.addListener('click', function() {
            populateInfoWindow(this,largeInfowindow);
            
        });

        
        location.marker = marker;
        self.locations.push(location);
    });

    //检测搜索输入
    this.inputData = ko.observable('');
    
    this.listFilter = ko.computed(function() {
        return ko.utils.arrayFilter(self.filter(),function(location) {
            if (location.name().indexOf(self.locationInput()) >= 0) {
                location.marker.setVisible(true);
                return true;
            } else {
                location.marker.setVisible(false);
                return false;
            }
        });
    });

    //列表点击
    self.locationClicked = function(location) {
        google.maps.event.trigger(location.marker,'click');
    };

    //搜索窗
    this.sideBarDisplay = ko.observable(false);


    //标记窗口信息及wiki API
    function populateInfoWindow(marker,infowindow) {
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map,marker);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            },1400);

            //wiki API
            var wikiUrl = 'https://zh.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title +'&format=json&callback=wikiCallback';
            $.ajax({
                url:wikiUrl,
                type: 'GET',
                dataType:'jsonp',
                headers: { 'Api-User-Agent': 'Example/1.0' },
                success: function(response) {
                    var articleList = response[3];
                    var articleStr = articleList[0];
                    infowindow.setContent('<a href= "' + articleStr +'">' + "Wikipedia-" + marker.title + '</a>')

                },
                error: function(XHR,textStatus,errorThrown) {
                    alert("error: " + textStatus);
                    alert("error: " + errorThrown);
                }
            });
                
            
        }
    }   
};

//过滤窗口淡入淡出
ko.bindingHandlers.fadeVisible = {
    init: function(element,valueAccessor) {
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value));
    },
    update: function(element,valueAccessor) {
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};

//Google地图错误显示
mapError = function() {
            alert("Google Maps failed to load.");
        };