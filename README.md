# blogger-js-comment-section

This loads Blogger post comments. Clicking the Reply button on each comment will show an embedded comment from to reply.

![Blogger threaded comments displayed using JavaScript](https://blogger.googleusercontent.com/img/a/AVvXsEjo3BNobLlVu99pj9dHaxotsWSZWJRYYFvgy6cTXgOoZBfAivLla5fNibFcUk97xC7sUH80LPQiFTwuxxxCb_eElWLGVmd-vqgOY_CVlV43hLvW2JDOu3UDp97Pv8KSm9IY_ha9ODmeX15828LR4uNew3MSKJq-Cd4aUbcwRhjlCZENgVqdLdgtJ_6m-WbI)

Tech:
- Blogger API v3

Requirements:
- Blogger API key

## How-To

Note: Implementation may vary.

Create a container for the comments:
```html
<div class="_comments"></div>
```

Then load the script after.

Update the following line with your API key:
```js
const API_KEY = '';
```

The blog ID and post ID should automatically set. But if it's not, e.g. due to template customization, you should provide it from here:
```js
const dataBlogId = $('._dataBlogId')?.textContent;
const dataPostId = $('._dataPostId')?.textContent;
const BLOG_ID = dataBlogId || $('head link[rel="service.post"]')?.href.split('feeds/')[1].split('/')[0];
const POST_ID = dataPostId || Array.from($$('head link[type="application/atom+xml"]')).find(e => e.href.includes('comments/default'))?.href.split('feeds/')[1].split('/')[0];
```
