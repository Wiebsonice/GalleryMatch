// ages.filter(checkAdult);
// document.querySelector('.messageCheckbox').checked
var filterBtn = document.querySelector('.filter-btn');
var filterOuter = document.querySelector('.filter');
var checkboxes = document.querySelector('.form-check');

var noJs = document.querySelector('.no-js-filter');

var checkOne = document.querySelector('.filter-box-1');
var checkTwo = document.querySelector('.filter-box-2');
var checkThree = document.querySelector('.filter-box-3');
var checkFour = document.querySelector('.filter-box-4');
var checkFive = document.querySelector('.filter-box-5');
var checkSix = document.querySelector('.filter-box-6');
var checkSeven = document.querySelector('.filter-box-7');

checkOne.addEventListener("click", function(){
    if (checkOne.checked) {
        filterNow(this.value)
    }
});
checkTwo.addEventListener("click", function(){
    if (checkTwo.checked) {
        filterNow(this.value)
    }
});
checkThree.addEventListener("click", function(){
    if (checkThree.checked) {
        filterNow(this.value)
    }
});
checkFour.addEventListener("click", function(){
    if (checkFour.checked) {
        filterNow(this.value)
    }
});
checkFive.addEventListener("click", function(){
    if (checkFive.checked) {
        filterNow(this.value)
    }
});
checkSix.addEventListener("click", function(){
    if (checkSix.checked) {
        filterNow(this.value)
    }
});
checkSeven.addEventListener("click", function(){
    if (checkSeven.checked) {
        filterNow("reset")
    }
});

function filterNow(style){
    var tiles = document.getElementsByClassName('art-expo-tile')

    if (style == "reset") {
        for (var i = 0; i < tiles.length; i++){
            tiles[i].classList.remove("hide");
        }
    } else {
        for (var i = 0; i < tiles.length; i++){
            if (tiles[i].classList.contains(style.toLowerCase())) {
                tiles[i].classList.remove("hide");
            } else {
                tiles[i].classList.add("hide");
            }
        }
    }
}

noJs.style.display = "none";
filterOuter.classList.remove("show");
filterBtn.addEventListener("click", function(){
    filterOuter.classList.toggle("show");
});
