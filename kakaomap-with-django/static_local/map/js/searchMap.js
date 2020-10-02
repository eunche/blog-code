// 키워드 검색을 요청하는 함수
const searchPlaces = () => {
    // id가 'keyword'인 input태그의 DOM 레퍼런스
    const keyword = document.getElementById('keyword').value;
}

const searchMap = () => {
    // 지도를 담을, id가 'map'인 div태그의 DOM 레퍼런스
    const mapElement = document.getElementById('map');

    // 지도의 옵션
    let options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
    }

    // (mapElement, options)을 토대로 map 객체를 생성
    let map = new kakao.maps.Map(mapElement, options);

    // 장소 검색 서비스 객체를 생성
    let places = new kakao.maps.services.Places();

    // 상단에 정의해놓은 searchPlaces 함수를 호출하여, 키워드로 장소를 검색
    searchPlaces();


}

searchMap()