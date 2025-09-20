(async function () {

    let $ = document.querySelector.bind(document);
    let $$ = document.querySelectorAll.bind(document);

    // custom utility for development
    if (typeof(wait?.Until) !== 'undefined') {
        await wait.Until(() => $('._isTemplateRendered'))
    }

    const dataBlogId = $('._dataBlogId')?.textContent;
    const dataPostId = $('._dataPostId')?.textContent;
    const BLOG_ID = dataBlogId || $('head link[rel="service.post"]')?.href.split('feeds/')[1].split('/')[0];
    const POST_ID = dataPostId || Array.from($$('head link[type="application/atom+xml"]')).find(e => e.href.includes('comments/default'))?.href.split('feeds/')[1].split('/')[0];
    const API_KEY = '';

    if (!POST_ID) {
        console.info('No post ID provided.')
        return;
    }

    const MAX_TOP = 5;
    const MAX_REPLY = 3;

    let allComments = [];
    let topOffset = 0;
    const replyOffsetMap = {};

    function fetchAllComments(pageToken = '', acc = []) {
        const fields = 'items(id,inReplyTo(id),published,content,author/displayName),nextPageToken';
        const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${POST_ID}/comments?key=${API_KEY}&fetchBodies=true&fields=${fields}${pageToken ? '&pageToken=' + pageToken : ''}`;
        return fetch(url)
            .then(res => res.json())
            .then(data => {
                const items = data.items || [];
                acc.push(...items);
                if (data.nextPageToken) {
                    return fetchAllComments(data.nextPageToken, acc);
                } else {
                    return acc;
                }
            });
    }

    function render() {
        const container = $('._comments');
        container.innerHTML = '';

        const topComments = allComments
            .filter(c => !c.inReplyTo)
            .sort((a, b) => new Date(b.published) - new Date(a.published));

        const slice = topComments.slice(0, topOffset + MAX_TOP);

        // top level comment
        // #comment
        slice.forEach(parent => {
            const div = document.createElement('div');
            div.className = 'comment';
            div.innerHTML = `
        <div>
            <span class="author">${parent.author.displayName}</span>
            <span class="meta">${new Date(parent.published).toLocaleString()}</span>
        </div>
        <div class="content">${parent.content}</div>
        <button class="btn reply-btn" data-id="${parent.id}">Reply</button>
        <div class="_replyFormDiv" data-id="${parent.id}"></div>
        <div class="replies" id="replies-${parent.id}"></div>
    `;
            container.appendChild(div);
            renderReplies(parent.id, div.querySelector('.replies'));
        });

        if (topOffset + MAX_TOP < topComments.length) {
            const more = document.createElement('button');
            more.className = 'btn';
            more.textContent = 'Read older comments';
            more.onclick = () => {
                topOffset += MAX_TOP;
                render();
            };
            container.appendChild(more);
        }

        // reply top level
        // #reply
        container.querySelectorAll('.reply-btn').forEach(btn => {
            btn.onclick = () => {
                let originalFormSrc = $('._dataPostCommentFormIframeSrc')?.textContent;
                let parentID = btn.dataset.id;

                if (!originalFormSrc) {
                    alert('Cannot post reply. Original form URL is required.')
                    return;
                }

                // hide others
                Array.from($$('._replyFormDiv')).forEach(e => e.innerHTML = '')

                let parentId = btn.dataset.id;
                let div = $(`._replyFormDiv[data-id="${parentId}"]`);
                div.innerHTML = `<iframe class="commentFrame" src="${originalFormSrc}&parentID=${parentID}">`
            };
        });
    }

    function renderReplies(parentId, container) {
        const replies = allComments
            .filter(c => c.inReplyTo && c.inReplyTo.id === parentId)
            .sort((a, b) => new Date(a.published) - new Date(b.published));

        replies.forEach(reply => {
            const div = document.createElement('div');
            div.className = 'comment';
            div.innerHTML = `
          <div>
            <span class="author">${reply.author.displayName}</span>
            <span class="meta">${new Date(reply.published).toLocaleString()}</span>
          </div>
          <div class="content">${reply.content}</div>
          <button class="btn reply-btn" data-id="${reply.id}">Reply</button>
          <div class="_replyFormDiv" data-id="${reply.id}"></div>
          <div class="replies"></div>
        `;
            container.appendChild(div);

            const nested = div.querySelector('.replies');
            renderReplies(reply.id, nested);
        });
    }


    fetchAllComments().then(data => {
        allComments = data;
        render();
    });

})();
