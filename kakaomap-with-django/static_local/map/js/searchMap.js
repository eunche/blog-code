const displayPlaces = (data) => {
    const results = document.querySelector(".search-results");

    // 이미 한번 검색을 했었다면, 재검색 이전에 이전 검색 결과 전부 삭제
    if (results.hasChildNodes()) {
        results.innerHTML = ``;
    }

    // 검색 결과 전부 표시
    let index = 1;
    for (const i of data) {
        results.insertAdjacentHTML('beforeend', `
        <li class="search-results__info">
            <div class="info-marker-wrapper">
                <div class="info-marker marker-${index}"></div>
            </div>
            <div class="info-text">
                <p><strong>${i.place_name}</strong></p>
                <p>${i.address_name}</p>
                <p class="info-text__address">${i.road_address_name}</p>
                <p class="info-text__phone-number">${i.phone}</p>
            </div>
        </li>
        `)
        index += 1;
    }

    // 검색결과에 해당되는 마커 전부 표시

    console.log(data)
}

const placesSearchCB = (data, status, pagination) => {
    if (status === kakao.maps.services.Status.OK) {
        // 검색 결과 목록과 마커를 표시하는 함수 호출
        displayPlaces(data);
        // 페이지 번호를 표시하는 함수 호출
        displayPagination(pagination);
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
const searchPlaces = (event) => {
    // event.preventDefault();

    // 장소 검색 서비스 객체를 생성
    let places = new kakao.maps.services.Places();


    // class가 'search-form__keyword'인 input태그의 DOM 레퍼런스
    let keyword = document.querySelector('.search-form__keyword').value;

    // keyword의 양옆 공백 제거
    keyword = keyword.replace(/^\s+|\s+$/g, '')

    // keyword값으로 검색을 하고, placesSearchCB는 검색이 완료되었을때 호출되는 함수 
    places.keywordSearch(keyword, placesSearchCB)
}



// 가장 먼저 호출되는 메인 함수 정의
const main = () => {

    // 지도를 담을, class가 'map'인 div태그의 DOM 레퍼런스
    const mapElement = document.querySelector('.map');

    // 지도의 옵션
    let options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
    }

    // (mapElement, options)을 토대로 map 객체를 생성
    let map = new kakao.maps.Map(mapElement, options);
}



main()