// 떠있는 오버레이를 전부 지우는 함수 정의
const removeOverlayAll = () => {
    for (const overlay of overlays) {
        overlay.setMap(null)
    }
}


// 마커가 생기면, DB에 의해 별 색을 업데이트하는 함수 정의
const updateStarColor = (title) => {
    const star = document.querySelector('.jsStar')


    $.ajax({
        url: update_api_url, // 클라이언트가 요청을 보낼 서버의 URL 주소
        data: { title, csrfmiddlewaretoken: csrf },                // HTTP 요청과 함께 서버로 보낼 데이터
        type: "POST",                             // HTTP 요청 방식(GET, POST)
        dataType: "json"                         // 서버에서 보내줄 데이터의 타입
    }).done(function (json) {
        star.innerText = json.text
        star.style.color = json.color
    })
}



// 오버레이의 별을 클릭하면 데이터 변경이 적용되는 함수 정의
const clickStar = (event) => {
    const info = event.target.parentElement.parentElement.parentElement;
    const title = info.querySelector(".jsplaceName").innerText;
    const address = info.querySelector(".ellipsis").innerText;
    const jibun = info.querySelector(".jibun").innerText;
    const lat = info.querySelector("#jsLat").value;
    const lng = info.querySelector("#jsLng").value;
    const link = info.querySelector(".link").getAttribute('href')

    $.ajax({
        url: api_url, // 클라이언트가 요청을 보낼 서버의 URL 주소
        data: { title, address, jibun, lat, lng, link, csrfmiddlewaretoken: csrf },                // HTTP 요청과 함께 서버로 보낼 데이터
        type: "POST",                             // HTTP 요청 방식(GET, POST)
        dataType: "json"                         // 서버에서 보내줄 데이터의 타입
    }).done(function (json) {

        info.querySelector(".jsStar").innerText = json.text
        info.querySelector(".jsStar").style.color = json.color
    })
}









// 지도를 담을, class가 'map'인 div태그의 DOM 레퍼런스
const mapElement = document.querySelector('.map');

// 지도의 옵션
let options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 3
}

// (mapElement, options)을 토대로 map 객체를 생성
let map = new kakao.maps.Map(mapElement, options);






// 오버레이,마커를 전부 담을 배열 초기화
let overlays = [];
let markers = [];

// 검색결과가 나왔을때, 지도의 확대범위를 정하는 변수 bounds 에 객체 할당
let bounds = new kakao.maps.LatLngBounds();

// 마커 클러스터러를 생성합니다 
let clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    minLevel: 10 // 클러스터 할 최소 지도 레벨 
});





$.ajax({
    url: get_api_url,                            // 클라이언트가 요청을 보낼 서버의 URL 주소
    data: { csrfmiddlewaretoken: csrf },     // HTTP 요청과 함께 서버로 보낼 데이터
    type: "POST",                                   // HTTP 요청 방식(GET, POST)
    dataType: "json"                                // 서버에서 보내줄 데이터의 타입
}).done(function (json) {
    let results = document.querySelector(".search-results");
    for (const fav of json) {
        let index = 1;

        // 왼쪽 창에 fav리스트 추가
        results.insertAdjacentHTML('beforeend', `
        <ul class="search-results__info">
            <div class="info-marker-wrapper">
                <div class="info-marker marker-${index}"></div>
            </div>
            <div class="info-text">
                <p><strong>${fav.fields.title}</strong></p>
                <p>${fav.fields.address}</p>
                <p class="info-text__address">${fav.fields.jibun}</p>
            </div>
        </ul>
        `)

        // 마커 객체를 생성하고, 표시할곳은 map객체 / 마커의 좌표는 position에 해당되는 값으로 설정
        let marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(fav.fields.lat, fav.fields.lng)
        });

        // 마커를 markers배열에 추가
        markers.push(marker)

        // 추가된 마커를 bounds에 추가
        bounds.extend(marker.getPosition())

        // 마커를 클릭했을때 나올 정보창(오버레이)의 HTML을 변수에 선언
        let overlayContent = `
        <div class="wrap">
            <div class="info">
                <div class="title">
                    <span class="jsplaceName">${fav.fields.title}</span>
                    <div class="close" onclick="removeOverlayAll()" title="닫기"></div>
                </div>
                <div class="body">
                    <div onclick="clickStar(event)" class="img">
                        <span class="jsStar">☆</span>
                    </div>
                    <div class="desc">
                        <div class="ellipsis">${fav.fields.address}</div>
                        <div class="jibun ellipsis">${fav.fields.jibun}</div>
                        <div><a href="${fav.fields.url}" target="_blank" class="link">홈페이지</a></div>
                    </div>
                </div>
                <input type="hidden" id="jsLat" value="${fav.fields.lat}"> 
                <input type="hidden" id="jsLng" value="${fav.fields.lng}"> 
            </div>
        </div>
        `
        // 정보창(오버레이) 객체를 생성하고, content는 위에 선언해놓은 overlayContent로,
        // 오버레이가 위치할 map은 이전에 생성한 map객체로, 오버레이의 위치는 마커위로 설정
        let overlay = new kakao.maps.CustomOverlay({
            content: overlayContent,
            map: map,
            position: marker.getPosition()
        });
        overlays.push(overlay)
        overlay.setMap(null)
        // 위에 생성한 마커 객체(marker)에, 클릭하면 오버레이가 화면에 보이도록 이벤트를 추가(한번만 해주면 됨)
        kakao.maps.event.addListener(marker, 'click', () => {
            removeOverlayAll()
            overlay.setMap(map);
            map.panTo(marker.getPosition());
            // DB갱신을 통한 별 색상 변경
            updateStarColor(fav.fields.title)
        });

        // 검색 결과를 클릭하면, 해당 좌표로 이동 및 오버레이 띄우게 설정
        results.lastElementChild.addEventListener('click', () => {
            map.panTo(marker.getPosition())
            removeOverlayAll()
            overlay.setMap(map);
            // DB갱신을 통한 별 색상 변경
            updateStarColor(fav.fields.title)
        })
    }
    map.setBounds(bounds);
    clusterer.addMarkers(markers)
})