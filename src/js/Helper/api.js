import BaseApi from '@js/Classes/LegacyApi';
import Utility from "@js/Classes/Utility";

class Api {

    constructor(endpoint, user, password) {
        this._api = new BaseApi(endpoint, user, password, null, true);
        this.passwords = [];
    }

    async login(endpoint, user, password) {
        this._api.login(endpoint, user, password);
        await this.reloadPasswords();
    }

    savePassword(user, password, title = null, website = null) {
        return new Promise((resolve, reject) => {
            this._api.createPassword(
                {
                    loginname: user,
                    pass     : password,
                    website  : title,
                    address  : website
                }
            ).then(() => {
                this.reloadPasswords();
                resolve();
            }).catch((e) => { reject(e); });
        });
    }

    updatePassword(id, user, password, title = null, website = null, notes = null, category = 0) {
        return new Promise((resolve, reject) => {
            let date = new Date();
            this._api.updatePassword(
                {
                    id         : id,
                    loginname  : user,
                    pass       : password,
                    website    : title,
                    address    : website,
                    notes      : notes.replace(/&quot;/g, '"'),
                    category   : category,
                    datechanged: date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()

                }
            ).then(() => {
                this.reloadPasswords();
                resolve();
            }).catch((e) => { reject(e); });
        });
    }

    reloadPasswords() {
        return new Promise((resolve, reject) => {
            this._api.listPasswords().then((rawData) => {
                let data = rawData.records;
                console.log(data);
                let passwords = [];
                for(let i in data) {
                    if(!data.hasOwnProperty(i) || data[i].deleted) continue;
                    let p    = data[i];



                    let host = p.server;


                    passwords.push(
                        {
                            id      : p.id,
                            title   : p.username,
                            host    : host,
                            user    : p.username,
                            password: p.password,
                            notes   : p.description,
                            category: p.type
                        }
                    );
                }

                this.passwords = passwords;
                browser.storage.local.set({'updated': new Date().getTime()})
                    .then(() => {resolve(passwords)})
                    .catch((e) => {reject(e)});
            }).catch((e) => {
                let message = e.message ? e.message:e.statusText;
                browser.notifications.create(
                    'api-request-failed',
                    {
                        type   : 'basic',
                        iconUrl: 'img/passwords-48.png',
                        title  : Utility.translate('PasswordRequestFailedTitle'),
                        message: Utility.translate('PasswordRequestFailedText', [message])
                    }
                );

                reject(e)
            });
        });
    }

    /**
     * this method tries to fix common encoding issues in the legacy app json
     *
     * @param p
     * @returns {string}
     */
    static escapeJson(p) {
        return p
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t')
            .replace(/\\/g, '\\\\')
            .replace(/", ,/g, '\",');
    }

    /**
     * the legacy api might return json with quotes in values
     * this method tries to fix that
     *
     * @param p
     * @returns {string}
     */
    static advancedEscapeJson(p) {
        let quot = '#Q#U#O#T#';

        return '{"' + p
            .replace(/^../, '')
            .replace(/..$/, '')
            .replace(/", "/g, quot + ',' + quot)
            .replace(/" : "/g, quot + ':' + quot)
            .replace(/": "/g, quot + ':' + quot)
            .replace(/"/g, '\\"')
            .replace(/#Q#U#O#T#/g, '"') + '"}';
    }

    static passwordEncodingFailedNotification(id) {
        browser.notifications.create(
            'api-request-failed-' + id,
            {
                type   : 'basic',
                iconUrl: 'img/passwords-48.png',
                title  : Utility.translate('PasswordEncodingFailedTitle'),
                message: Utility.translate('PasswordEncodingFailedText', [id])
            }
        );
    }

    getPasswords() {
        return this.passwords;
    }
}

const api = new Api(null, null, null);

export default api;