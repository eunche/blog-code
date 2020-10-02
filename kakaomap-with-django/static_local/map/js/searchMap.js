const searchMap = () => {
    // 지도를 담을, id가 'map'인 div태그의 DOM 레퍼런스
    const mapElement = document.getElementById('map');

    // 지도의 옵션
    let options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
    }

    // (mapElement, options)을 토대로 map 객체 생성
    let map = new kakao.maps.Map(mapElement, options);


}

searchMap()