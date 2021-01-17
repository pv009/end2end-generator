basicConfig = {
    "imports": [],
    "test_variables": [],
    "before_all": [],
    "before_each": [],
    "after_all": [],
    "after_each": []
}

class BasicConfig:
    def __init__(self, data):
        self.viewWidth = data['viewWidth']
        self.viewHeight = data['viewHeight']
        self.viewZoom = data['viewZoom']
        self.startURL = "http://localhost:4200/" + data['startURL']
        self.urlEnd = data['startURL']

    def write_imports(self):
        basicConfig['imports'] = [
            "import * as puppeteer from \'puppeteer\';\n",
            "import * as assert from 'assert';",
            "\n"
        ]

    def global_test_variables(self):
        basicConfig['test_variables'] = [
            'let browser;\n',
            'let page;\n',
            "const startURL = '" + self.startURL + "';\n"
            'let currentURL: string;'
        ]

    def write_before_each(self):
        before_each = ["beforeEach(async () => {\n",
                       "browser = await puppeteer.launch();\n",
                       "page = await browser.newPage();\n",
                       "await page.setViewport({\n",
                       "width: " + self.viewWidth + ",\n",
                       "height: " + self.viewHeight + ",\n",
                       "deviceScaleFactor: " + self.viewZoom + ",\n",
                       "});\n",
                       "currentURL = '" + self.startURL + "';\n",
                       "await page.goto('" + self.startURL + "');\n",
                       "await page.waitForSelector('.acceptButton:nth-of-type(2)');\n",
                       "await page.click('.acceptButton:nth-of-type(2)');\n",
                       "});\n"
                       ]

        for line in before_each:
            basicConfig['before_each'].append(line)


    def set_global_config(self):
        self.write_imports()
        self.global_test_variables()
        self.write_before_each()
        return basicConfig

