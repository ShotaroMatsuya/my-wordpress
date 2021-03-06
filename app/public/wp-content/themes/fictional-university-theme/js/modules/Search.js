import $ from 'jquery';

class Search {
  //1. describe and create/initiate our object
  constructor() {
    this.addSearchHTML(); //最初にDOMを生成
    this.resultsDiv = $('#search-overlay__results');
    this.openButton = $('.js-search-trigger');
    this.closeButton = $('.search-overlay__close');
    this.searchOverlay = $('.search-overlay');
    this.searchField = $('#search-term');
    this.events();
    this.isOverlayOpen = false;
    this.isSpinnerVisible = false;
    this.previousValue;
    this.typingTimer;
  }
  //2 . events
  events() {
    this.openButton.on('click', this.openOverlay.bind(this));
    this.closeButton.on('click', this.closeOverlay.bind(this));
    // callbackのthisはclickしたhtmlDocumentに変わってしまうのでbindする必要がある
    $(document).on('keydown', this.keyPressDispatcher.bind(this));
    this.searchField.on('keyup', this.typingLogic.bind(this)); //"keydown"にしてしまうとinputのvalueをupdateする前にfireされてしまうのでここは"keyup"を用いる
  }

  //3. methods (function, action...)
  typingLogic() {
    if (this.searchField.val() != this.previousValue) {
      //文字入力以外のkeyを押したときにrequestを再度実行しないように
      clearTimeout(this.typingTimer);
      if (this.searchField.val()) {
        //入力時
        if (!this.isSpinnerVisible) {
          this.resultsDiv.html('<div class="spinner-loader"></div>');
          this.isSpinnerVisible = true;
        }
        this.typingTimer = setTimeout(this.getResults.bind(this), 750);
      } else {
        //まだ入力してないとき
        this.resultsDiv.html('');
        this.isSpinnerVisible = false;
      }
    }
    this.previousValue = this.searchField.val();
  }
  getResults() {
    $.getJSON(
      universityData.root_url +
        '/wp-json/university/v1/search?term=' +
        this.searchField.val(),
      results => {
        this.resultsDiv.html(`
        <div class="row">
          <div class="one-third">
            <h2 class="search-overlay__section-title">General Information</h2>
            ${
              results.generalInfo.length
                ? '<ul class="link-list min-list">'
                : '<p>検索結果がありません</p>'
            }
            ${results.generalInfo
              .map(
                item =>
                  `<li><a href="${item.permalink}">${item.title}</a> ${
                    item.postType == 'post' ? `by ${item.authorName}` : ''
                  }</li>`
              )
              .join('')}
            ${results.generalInfo.length ? '</ul>' : ''}
          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">講義</h2>
            ${
              results.programs.length
                ? '<ul class="link-list min-list">'
                : `<p>検索結果はありません<a href="${universityData.root_url}/programs">View all programs</a></p>`
            }
            ${results.programs
              .map(
                item => `<li><a href="${item.permalink}">${item.title}</a></li>`
              )
              .join('')}
            ${results.programs.length ? '</ul>' : ''}
            <h2 class="search-overlay__section-title">教授</h2>
            ${
              results.professors.length
                ? '<ul class="professor-cards">'
                : `<p>検索結果はありません</p>`
            }
            ${results.professors
              .map(
                item => `
                <li class="professor-card__list-item">
                    <a class="professor-card" href="${item.permalink}">
                        <img class="professor-card__image" src="${item.image}"> 
                        <span class="professor-card__name">
                            ${item.title}</span>
                    </a>
                </li>
            `
              )
              .join('')}
            ${results.professors.length ? '</ul>' : ''}

          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Campuses</h2>
            ${
              results.campuses.length
                ? '<ul class="link-list min-list">'
                : `<p>キャンパスはありません<a href="${universityData.root_url}/campuses">View all campuses</a></p>`
            }
            ${results.campuses
              .map(
                item => `<li><a href="${item.permalink}">${item.title}</a></li>`
              )
              .join('')}
            ${results.campuses.length ? '</ul>' : ''}


            <h2 class="search-overlay__section-title">Events</h2>    
            ${
              results.events.length
                ? ''
                : `<p>イベント情報がありません<a href="${universityData.root_url}/events">View all events</a></p>`
            }
            ${results.events
              .map(
                item =>
                  `
                  <div class="event-summary">
                  <a class="event-summary__date t-center" href="${item.permalink}">
                      <span class="event-summary__month">
                      ${item.month}
                      </span>
                      <span class="event-summary__day">
                      ${item.day}
                      </span>
                  </a>
                  <div class="event-summary__content">
                      <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
                      <p>${item.description}<a href="${item.permalink}" class="nu gray">Learn more</a></p>
                  </div>
              </div>
                  
                  `
              )
              .join('')}
      
          </div>
        </div>
      `);
        this.isSpinnerVisible = false;
      }
    );

    // //delete this code a bit later on
    // //whenメソッド内部の処理はasynchronousに実行される
    // //すべての処理が終了したらthenメソッド内部の処理が実行される
    // $.when(
    //   $.getJSON(
    //     //functions.phpから値(universityDataを取得)
    //     universityData.root_url +
    //       "/wp-json/wp/v2/posts?search=" +
    //       this.searchField.val()
    //   ),
    //   $.getJSON(
    //     universityData.root_url +
    //       "/wp-json/wp/v2/pages?search=" +
    //       this.searchField.val()
    //   )
    // ).then(
    //   (posts, pages) => {
    //     var combinedResults = posts[0].concat(pages[0]); //2つのarrayを結合
    //     this.resultsDiv.html(`
    //     <h2 class="search-overlay__section-title">General Information</h2>
    //     ${
    //       combinedResults.length
    //         ? '<ul class="link-list min-list">'
    //         : "<p>No general information matches that search.</p>"
    //     }
    //     ${combinedResults
    //       .map(
    //         (item) =>
    //           `<li><a href="${item.link}">${item.title.rendered}</a> ${
    //             item.type == "post" ? `by ${item.authorName}` : ""
    //           }</li>`
    //       )
    //       .join("")}
    //     ${combinedResults.length ? "</ul>" : ""}
    //     `);
    //     //htmlElementが格納された配列をtemplateLiteralで展開するとそのままHTMLドキュメントとして出力される
    //     //join('')を使うことで、arrayの区切り(カンマ)をなくしてstrings型として展開することができる
    //     this.isSpinnerVisible = false;
    //   },
    //   () => {
    //     //thenメソッドの第2引数にerror時のコールバックを書く
    //     this.resultsDiv.html("<p>Unexpected Error; Please try again.</p>");
    //   }
    // );
  }

  keyPressDispatcher(e) {
    if (
      e.keyCode == 83 &&
      !this.isOverlayOpen &&
      !$('input, textarea').is(':focus') // page内のフォームがフォーカスされている場合はsearch-overlayが表示されないようにする
    ) {
      this.openOverlay();
    }
    if (e.keyCode == 27 && this.isOverlayOpen) {
      this.closeOverlay();
    }
  }
  openOverlay() {
    this.searchOverlay.addClass('search-overlay--active');
    $('body').addClass('body-no-scroll');
    this.searchField.val('');
    setTimeout(() => this.searchField.focus(), 301); //fadeInが300msなので少し遅めにする
    this.isOverlayOpen = true;
    return false;
  }
  closeOverlay() {
    this.searchOverlay.removeClass('search-overlay--active');
    $('body').removeClass('body-no-scroll');
    this.isOverlayOpen = false;
  }
  addSearchHTML() {
    $('body').append(`
    <div class="search-overlay">
        <div class="search-overlay__top">
            <div class="container">
                <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
                <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term">
                <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
            </div>
        </div>
        <div class="container">
            <div id="search-overlay__results"></div>
        </div>
    </div>
    `);
  }
}

export default Search;
