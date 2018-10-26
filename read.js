console.log("Welcome to readability.");
readConvertLinksToFootnotes = false;
readStyle = 'style-newspaper';
readSize = 'size-medium';
readMargin = 'margin-wide';
_readability_script = document.createElement('script');
_readability_script.type = 'text/javascript';
//_readability_script.src = 'http://ejucovy.github.io/readability/js/readability.js?x=' + (Math.random());
_readability_script.src='https://djoldman.github.io/readability.moz.js';
document.documentElement.appendChild(_readability_script);
_readability_css = document.createElement('link');
_readability_css.rel = 'stylesheet';
//_readability_css.href = 'http://ejucovy.github.io/readability/css/readability.css?1';
_readability_css.href='https://djoldman.github.io/readability.css';
_readability_css.type = 'text/css';
_readability_css.media = 'all';
document.documentElement.appendChild(_readability_css);
_readability_print_css = document.createElement('link');
_readability_print_css.rel = 'stylesheet';
//_readability_print_css.href = 'http://ejucovy.github.io/readability/css/readability-print.css';
_readability_print_css.href='https://djoldman.github.io/readability-print.css';
_readability_print_css.media = 'print';
_readability_print_css.type = 'text/css';
document.getElementsByTagName('head')[0].appendChild(_readability_print_css);
const CLASSES_TO_PRESERVE = [
    "caption",
    "emoji",
    "hidden",
    "invisble",
    "sr-only",
    "visually-hidden",
    "visuallyhidden",
    "wp-caption",
    "wp-caption-text",
    "wp-smiley",
];
let options = {
  classesToPreserve: CLASSES_TO_PRESERVE,
};

function _showContent(article) {
  this._messageElement.classList.remove("reader-show-element");

  this._article = article;

  this._domainElement.href = article.url;
  let articleUri = Services.io.newURI(article.url);
  this._domainElement.textContent = this._stripHost(articleUri.host);
  this._creditsElement.textContent = article.byline;

  this._titleElement.textContent = article.title;
  this._readTimeElement.textContent = this._formatReadTime(article.readingTimeMinsSlow, article.readingTimeMinsFast);
  this._doc.title = article.title;

  this._headerElement.classList.add("reader-show-element");

  let parserUtils = Cc["@mozilla.org/parserutils;1"].getService(Ci.nsIParserUtils);
  let contentFragment = parserUtils.parseFragment(article.content,
    Ci.nsIParserUtils.SanitizerDropForms | Ci.nsIParserUtils.SanitizerAllowStyle,
    false, articleUri, this._contentElement);
  this._contentElement.innerHTML = "";
  this._contentElement.appendChild(contentFragment);
  this._maybeSetTextDirection(article);
  this._foundLanguage(article.language);

  this._contentElement.classList.add("reader-show-element");
  this._updateImageMargins();

  this._requestFavicon();
  this._doc.body.classList.add("loaded");

  this._goToReference(articleUri.ref);

  Services.obs.notifyObservers(this._win, "AboutReader:Ready");

  this._doc.dispatchEvent(
    new this._win.CustomEvent("AboutReaderContentReady", { bubbles: true, cancelable: false }));
}

var article = this._readability_script.Readability(document, options).parse();
_showContent(article)
