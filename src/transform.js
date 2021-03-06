import * as fetch from './fetch'
import * as url from './const'
import EventProxy from 'eventproxy'

let toastTime = 2000,
    infoToastTime = 6000

class Query {
    constructor(option) {
        this.ep = new EventProxy()
        this.url = {}

        for(var value in option) {
            this.url[value] = option[value]
        }
    }

    queryList(page) {
        if (!this.url.queryList) return
        if (!page) page = 1

        fetch.get(this.url.queryList, {page: page}, json => {
            if (json.error) {
                return Materialize.toast(json.msg, this.infoToastTime)
            }
            this.ep.emit('queryList', json)
        })
    }

    queryById(id) {
        if (!this.url.queryById) return

        fetch.get(this.url.queryById, id, json => {
            if (json.error) {
                return Materialize.toast(json.msg, this.infoToastTime)
            }
            this.ep.emit('queryById', json)
        })
    }
}

class Transform extends Query {
    constructor(option) {
        super(option)
        this.toastTime = toastTime
        this.infoToastTime = infoToastTime
    }

    add(data) {
        fetch.post(this.url.add, data, json => {
            Materialize.toast(json.msg, this.toastTime)
            if(json.success) this.ep.emit('add')
        })
    }

    del(id) {
        fetch.get(this.url.del, id, json => {
            Materialize.toast(json.msg, this.toastTime)
            if(json.success) this.ep.emit('del')
        })
    }

    update(data) {
        fetch.post(this.url.update, data, json => {
            Materialize.toast(json.msg, this.toastTime)
            if(json.success) this.ep.emit('update')
        })
    }
}

class TagTransform extends Transform {
    constructor(option) {
        super(option)
    }

    addTag(data) {
        fetch.get(this.url.addTag, data, result => {
            if(result.success) this.ep.emit('addTag')
        })
    }

    delTag(data) {
        fetch.get(this.url.delTag, data, result => {
            if(result.success) this.ep.emit('delTag')
        })
    }
}

let manager_about = (function() {
    let ep = new EventProxy()

    return {
        ep: ep,
        query() {
            fetch.get(url.about.QUERY, result => {
                this.content = result
                ep.emit('query', result)
            })
        },
        update(data) {
            fetch.post(url.about.UPDATE, data, result => {
                Materialize.toast(result.msg, toastTime)
                if (result.success) ep.emit('update') 
            })
        }
    }

})()

let app_about = (function() {
    let ep = new EventProxy()

    return {
        ep: ep,
        query() {
            fetch.get(url.app.QUERY_ABOUT, result => {
                ep.emit('query', result)
            })
        }
    }

})()

let app_banner = (function(store) {
    let ep = new EventProxy()

    return {
        ep: ep,
        query() {
            fetch.get(url.app.QUERY_BANNER, result => {
                ep.emit('query', result)
            })
        }
    }

})()

let app_tag = (function() {
    let ep = new EventProxy()

    return {
        ep: ep,
        query(data) {
            fetch.get(url.app.QUERY_CONTENT_BY_TAG, data, result => {
                ep.emit('queryContentByTag', result)
            })
        }
    }
})()

export let manager = {
    blog: new TagTransform({
        add: url.blog.ADD,
        update: url.blog.UPDATE,
        del: url.blog.DEL,
        queryList: url.blog.QUERY_LIST,
        queryById: url.blog.QUERY_BY_ID,
        addTag: url.blog.ADD_TAG,
        delTag: url.blog.DEL_TAG
    }),

    article: new TagTransform({
        add: url.article.ADD,
        update: url.article.UPDATE,
        del: url.article.DEL,
        queryList: url.article.QUERY_LIST,
        queryById: url.article.QUERY_BY_ID,
        addTag: url.article.ADD_TAG,
        delTag: url.article.DEL_TAG
    }),
    
    tips: new TagTransform({
        add: url.tips.ADD,
        update: url.tips.UPDATE,
        del: url.tips.DEL,
        queryList: url.tips.QUERY_LIST,
        queryById: url.tips.QUERY_BY_ID,
        addTag: url.tips.ADD_TAG,
        delTag: url.tips.DEL_TAG
    }),

    about: manager_about,

    banner: new TagTransform({
        add: url.banner.ADD,
        update: url.banner.UPDATE,
        del: url.banner.DEL,
        queryList: url.banner.QUERY_LIST,
        queryById: url.banner.QUERY_BY_ID
    })
}

export let app = {
    blog: new Query({
        queryList: url.app.QUERY_BLOG_LIST,
        queryById: url.app.QUERY_BLOG
    }),
    article: new Query({
        queryList: url.app.QUERY_ARTICLE_LIST,
        queryById: url.app.QUERY_ARTICLE
    }),
    tips: new Query({
        queryList: url.app.QUERY_TIPS_LIST,
        queryById: url.app.QUERY_TIPS
    }),
    about: app_about,
    banner: app_banner,
    tag: app_tag
}

export function login(username, password) {
    fetch.post(url.base.LOGIN, {username:username, password:password}, data => {
        if(!data.passValidate) Materialize.toast(data.msg, toastTime)
            else window.location.href = url.blog.ROOT
    })
}
