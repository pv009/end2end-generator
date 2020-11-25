const fs = require('fs');
const xmlWriter = require('xml-writer');
const moment = require('moment');
const Parse = require('parse/node');

Parse.initialize('edecy_prod', 'cHg8C1)M?43X^ZI');
Parse.serverURL = 'https://parse.edecy.de/parse';


const baseFileUrl = '/var/www/html/prod-ssr/';

var ws = new fs.createWriteStream('./dist/edecy-portal/sitemap.xml');

const dontCrawl = [
    'register',
    'forgot-password',
    'reset-password',
    'login',
    'verified',
    'welcome',
    'imprint',
    'privacy-policy',
    'terms-of-use',
    'support',
    'feedback',
    'profiles',
    'cards',
    'settings',
    'update-profile',
    'change-password',
    'chat',
    'logout',
    'delete-account'

]

ws.on('close', function () {
    console.log('Wrote sitemap');
});

const xw = new xmlWriter(false, function (string, encoding) {
    ws.write(string, encoding);
});

xw.startDocument('1.0', 'UTF-8');
xw.startElement('urlset').writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
xw.startElement('url');
xw.startElement('loc').text('http://portal.edecy.de/cards/list').endElement();
xw.startElement('lastmod').text(moment().format('YYYY-MM-DD')).endElement();
xw.startElement('changefreq').text('weekly').endElement();
xw.startElement('priority').text('1').endElement();
xw.endElement();

function crawlProfiles() {
    const query = new Parse.Query('Profiles');
    query.equalTo('status', 'published');

    query.find()
        .then(function (results) {
            for (let i = 0; i < results.length; i++) {
                xw.startElement('url');
                xw.startElement('loc').text('http://portal.edecy.de/profiles/' + results[i].toJSON().objectId).endElement();
                xw.startElement('lastmod').text(moment().format('YYYY-MM-DD')).endElement();
                xw.startElement('changefreq').text('weekly').endElement();
                xw.startElement('priority').text('1').endElement();
                xw.endElement();
            }
        })
        .catch(function (error) {
            console.error('Error fetching cards: ', error);
        });
}

function crawlCards() {
    const query = new Parse.Query('Ads');
    query.equalTo('status', 'published');

    query.find()
        .then(function (results) {
            for (let i = 0; i < results.length; i++) {
                xw.startElement('url');
                xw.startElement('loc').text('http://portal.edecy.de/cards/' + results[i].toJSON().objectId).endElement();
                xw.startElement('lastmod').text(moment().format('YYYY-MM-DD')).endElement();
                xw.startElement('changefreq').text('weekly').endElement();
                xw.startElement('priority').text('1').endElement();
                xw.endElement();
            }
        })
        .catch(function (error) {
            console.error('Error fetching cards: ', error);
        });
}

function crawlRouting() {
    let files = [
        baseFileUrl + 'app-routing.module.ts',

    ];

    for (let i = 0; i < files.length; i++) {
        var lineReader = require('readline').createInterface({
            input: fs.createReadStream(files[i])
        });

        lineReader.on('line', function (line) {
            if (line.includes('path:')) {
                let path = line.split('\'')[1]

                if (!path.includes(':') && path.length > 0 && !path.includes('*') && dontCrawl.indexOf(path) < 0) {
                    xw.startElement('url');
                    xw.startElement('loc').text('http://portal.edecy.de/' + path).endElement();
                    xw.startElement('lastmod').text(moment().format('YYYY-MM-DD')).endElement();
                    xw.startElement('changefreq').text('weekly').endElement();
                    xw.startElement('priority').text('1').endElement();
                    xw.endElement();
                }

            }

        });
    }
}

crawlCards();
crawlProfiles();
crawlRouting();


setTimeout(function () {
    xw.endElement();
    ws.end();
}, 5000);