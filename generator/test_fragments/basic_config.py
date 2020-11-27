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
        self.startURL = data['startURL']

    def write_imports(self):
        basicConfig['imports'] = [
            'import * as puppeteer from \'puppeteer\';\n'
        ]

    def global_test_variables(self):
        basicConfig['test_variables'] = [
            'let browser;\n',
            'let page;\n',
            'const startURL = ' + self.startURL + ";\n"
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
                       "currentURL = " + self.startURL + ";\n"
                       "});\n",
                       "});\n"]
        for line in before_each:
            basicConfig['before_each'].append(line)

    def set_global_config(self):
        self.write_imports()
        self.global_test_variables()
        self.write_before_each()
        return basicConfig

