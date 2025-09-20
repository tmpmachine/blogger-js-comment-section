# blogger-js-comment-section

This loads Blogger post comments.

Tech:
- Blogger API v3

Requirements:
- Blogger API key

How-to:

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
