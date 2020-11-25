
written_tests = []

class TestWriter:
    def __init__(self, data):
        print("initiated writer")
        self.acceptence_criteria = data['acceptence_criteria']


    def writeTest(self, title):
        test = ("it('" + title + "', async (done: DoneFn) => {\n"
                "await page.goto('http://localhost:4200');\n"
                "await page.screenshot({ path: 'example.png' });\n"
                "browser.close().then(done());\n"
                "});\n")
        written_tests.append(test)

    def generate_tests(self):
        for criteria in self.acceptence_criteria:
            self.writeTest(criteria)

    def return_written_tests(self):
        self.generate_tests()
        return written_tests