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



// 검색 결과 목록과 마커를 표시하는 함수 정의
const displayPlaces = (data) => {
    const results = document.querySelector(".search-results");

    // 이미 한번 검색을 했었다면, 재검색 이전에 이전 검색 결과 / 마커 / 오버레이 / bounds 새로 생성
    if (results.hasChildNodes()) {
        results.innerHTML = ``;
    }
    for (const marker of markers) {
        marker.setMap(null);
    }
    removeOverlayAll()
    delete bounds;
    bounds = new kakao.maps.LatLngBounds();


    // 검색 결과 전부 표시
    let index = 1;
    for (const i of data) {
        results.insertAdjacentHTML('beforeend', `
        <ul class="search-results__info">
            <div class="info-marker-wrapper">
                <div class="info-marker marker-${index}"></div>
            </div>
            <div class="info-text">
                <p><strong>${i.place_name}</strong></p>
                <p>${i.address_name}</p>
                <p class="info-text__address">${i.road_address_name}</p>
            </div>
        </ul>
        `)
        // <마커 표시 코드 시작>
        // 마커 객체를 생성하고, 표시할곳은 map객체 / 마커의 좌표는 position에 해당되는 값으로 설정
        let marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(i.y, i.x)
        });

        // markers 배열에 마커 추가
        markers.push(marker)

        // 마커를 클릭했을때 나올 정보창(오버레이)의 HTML을 변수에 선언
        let overlayContent = `
        <div class="wrap">
            <div class="info">
                <div class="title">
                    <span class="jsplaceName">${i.place_name}</span>
                    <div class="close" onclick="removeOverlayAll()" title="닫기"></div>
                </div>
                <div class="body">
                    <div onclick="clickStar(event)" class="img">
                        <span class="jsStar">☆</span>
                    </div>
                    <div class="desc">
                        <div class="ellipsis">${i.road_address_name}</div>
                        <div class="jibun ellipsis">${i.road_address_name}</div>
                        <div><a href="${i.place_url}" target="_blank" class="link">홈페이지</a></div>
                    </div>
                </div>
                <input type="hidden" id="jsLat" value="${i.y}"> 
                <input type="hidden" id="jsLng" value="${i.x}"> 
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
        overlay.setMap(null)

        // overlays 배열에 overlay를 추가
        overlays.push(overlay)

        // 위에 생성한 마커 객체(marker)에, 클릭하면 오버레이가 화면에 보이도록 이벤트를 추가(한번만 해주면 됨)
        kakao.maps.event.addListener(marker, 'click', () => {
            removeOverlayAll()
            overlay.setMap(map);
            map.panTo(marker.getPosition());
            // DB갱신을 통한 별 색상 변경
            updateStarColor(i.place_name)
        });

        // 검색 결과를 클릭하면, 해당 좌표로 이동 및 오버레이 띄우게 설정
        results.lastElementChild.addEventListener('click', () => {
            map.panTo(marker.getPosition())
            removeOverlayAll()
            overlay.setMap(map);
            // DB갱신을 통한 별 색상 변경
            updateStarColor(i.place_name)
        })

        // 검색 결과가 나왔을때, 지도의 확대정도를 정하는 bounds 변수에 마커의 좌표 추가
        bounds.extend(marker.getPosition())

        index += 1;
    }
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}



// 검색이 완료되었을때 호출되는 함수 정의
const placesSearchCB = (data, status, pagination) => {
    if (status === kakao.maps.services.Status.OK) {
        // 검색 결과 목록과 마커를 표시하는 함수 호출
        displayPlaces(data);
        // 페이지 번호를 표시하는 함수 호출
        // displayPagination(pagination);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        // 검색 결과가 없는 경우 에러 발생
        alert('검색 결과가 존재하지 않습니다.');
        return;
    } else if (status === kakao.maps.services.Status.ERROR) {
        // 검색에 문제가 있는 경우 에러 발생
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
    }
}



// 키워드 검색을 요청하는 함수 정의
const searchPlaces = () => {

    // 장소 검색 서비스 객체를 생성
    let places = new kakao.maps.services.Places();


    // class가 'search-form__keyword'인 input태그의 DOM 레퍼런스
    let keyword = document.querySelector('.search-form__keyword').value;

    // keyword의 양옆 공백 제거
    keyword = keyword.replace(/^\s+|\s+$/g, '')

    // keyword값으로 검색을 하고, placesSearchCB는 검색이 완료되었을때 호출되는 함수 
    places.keywordSearch(keyword, placesSearchCB)
}






// 마커를 전부 담을 배열 초기화
let markers = [];

// 오버레이 전부 담을 배열 초기화
let overlays = [];

// 검색결과가 나왔을때, 지도의 확대범위를 정하는 변수 bounds 초기화
let bounds;









// 지도를 담을, class가 'map'인 div태그의 DOM 레퍼런스
const mapElement = document.querySelector('.map');

// 지도의 옵션
let options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 3
}

// (mapElement, options)을 토대로 map 객체를 생성
let map = new kakao.maps.Map(mapElement, options);


