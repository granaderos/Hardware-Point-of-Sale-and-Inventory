$(function(){
    displayTransactionRecords();
    displayPager();

    $('#pageLimit_form').submit(function(){
        var regextInt = /^[0-9]+$/;
        var pageLimit = parseInt($('#pageLimit').val());

        if(regextInt.test(pageLimit) && pageLimit > 0){
            $('#currentPage').val(0)
            displayTransactionRecords();
            displayPager();
            $(this).css('color','#000');
        }else{
            $(this).css('color', '#f00');
        }
        $('.page_number').html(1);
        return false;
    });


    /*----pagination-----*/
    $('.pagination').on('click','li a',function(){

        $('.pagination li').removeClass('active');
        var pageOnTracked = 0; //used in paganation
        var maxPage = parseInt($('.max_page').html());
        var liParent = $(this.parentNode);
        var pageNum = liParent.index()+1;
        var limit=0;
        var current_page = $(this).html();
        $("#currentPage").val(current_page - 1);
        if(maxPage > 6){

            if((pageNum == 6 || pageNum == 7) && current_page < maxPage){
                limit = parseInt(current_page)+5;
                if(limit >= maxPage){
                    pageOnTracked = maxPage-6;
                }else{
                    pageOnTracked = parseInt(current_page) - 1;
                }
                displayListPager(pageOnTracked);
            }else if(pageNum == 1 || pageNum == 2){
                limit = parseInt(current_page)-5;
                if(limit > 0){
                    pageOnTracked = current_page - 5;
                }else{
                    pageOnTracked = 1;
                }
                displayListPager(pageOnTracked);
            }

            $('#page_'+current_page).toggleClass('active');
        }else{
            liParent.toggleClass("active");
        }
        displayTransactionRecords();

        $('.page_number').html(current_page);
    })

    $('.pagination').on('click','button',function(){
        var pageBtn = $(this).text();
        var currentPage = parseInt($('#currentPage').val());
        var maxPage = parseInt($('.pagination li a:last').html())-1;
        var firstPageOnlist = parseInt($('.pagination li a:first').html());
        var pageActive = $('.pagination .active');
        var activeLi = 0;
        if(pageBtn == "next" && currentPage < maxPage ){
            activeLi = currentPage+2;
            if(pageActive.index() == 5 && activeLi+1 <= 9){
                displayListPager(firstPageOnlist+1);
            }
            $('#currentPage').val(currentPage+1);
            pageActive.removeClass('active');
            $('#page_'+activeLi).toggleClass('active');
            $('.page_number').html(currentPage+2);
        }else if(pageBtn == "prev" && currentPage > 0){
            if(pageActive.index() == 1 && currentPage > 1){
                displayListPager(firstPageOnlist-1);
            }
            $('#currentPage').val(currentPage-1);
            pageActive.removeClass('active');
            $('#page_'+currentPage).toggleClass('active');
            $('.page_number').html(currentPage);
        }

        displayTransactionRecords();
    });
    $('#graph-toggle-div').click(function(){
        $('#graph-sales-container-div').slideToggle(1000);
    }).tooltip('hide');

});

function displayTransactionRecords() {
    var pageLimit = parseInt($('#pageLimit').val());
    var currentPage = parseInt($('#currentPage').val());
    currentPage = currentPage*pageLimit;
    var obj = {currentPage:currentPage,pageLimit:pageLimit};
    $.ajax({
        type:"POST",
        url:"php/objects/sales/displayTransactionRecords.php",
        data:obj,
        beforeSend:function(){
            $('#loading_div').show();
        },
        success:function(data){
            $('#transaction_record_tbody').html(data);
        },
        error:function(data){
            console.log("Error on displaying transaction records => "+ data['status']+ " "+ data['statusText']);
        },
        complete:function(){
            $('#loading_div').hide();
        }
    })
}

function displayPager(){
    var pageLimit = parseInt($('#pageLimit').val());
    var currentPage = parseInt($('#currentPage').val())+1;
    var obj = {pageLimit:pageLimit};
    $.ajax({
        type: 'POST',
        url: 'php/objects/sales/displayPager.php',
        data: obj,
        success:function(data){
            console.log("pagersss = " + data);
            var pagerContent = JSON.parse(data);
            $('.pagination').html(pagerContent.pager);
            if(pagerContent.n_pages == 0){
                currentPage = 0;
            }
            $('.max_page').html(pagerContent.n_pages);

        },
        error:function(data){
            console.log("Error on displaying pager => "+ data['status'] + " " + data['statusText']);
        }
    })
}

function displayListPager(pageOnTracked){
    var newPagerLi = "";
    var newPagerAll = "";
    for(var ctr=1; ctr<=7; ctr++){
        newPagerLi += "<li id=page_"+pageOnTracked+"><a href = 'Javascript:void(0)'>"+pageOnTracked+"</a></li>";
        pageOnTracked++;
    }
    newPagerAll += "<button class='btn-primary' id='pager_prev'>prev</button>";
    newPagerAll += "<ul>";
    newPagerAll +=    newPagerLi;
    newPagerAll += "</ul>";
    newPagerAll += "<button class='btn-primary' id='pager_next'>next</button>";

    $(".pagination").html(newPagerAll);
}