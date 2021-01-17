
class ComponentInteraction:
    def __init__(self):
        print("initiated component interaction")

    def find_element_by_class(self, element_type, class_name, index):
        selector = element_type + "." + class_name
        command = "await page.$$('" + selector + "')[" + index + "];"
        return [command + "\n"]

    def find_element_by_id(self, element_id):
        selector = "#" + element_id
        command = "await page.$$('" + selector + "');"
        return [command + "\n"]

    def find_element_by_type(self, element_type, index, var_name):
        command = "await page.$$('" + element_type + "')[" + index + "];"
        return [command + "\n"]

    def click_button_by_class(self, class_name, index):
        selector = "button." + class_name
        command = "await page.click('" + selector + "');"
        return [command + "\n"]

    def click_button_by_id(self, button_id):
        selector = "#" + button_id
        command = "await page.click('" + selector + "');\n"
        return command

    def click_any_button(self, selector):
        command = "await page.click('" + selector + "');"
        return [command + "\n"]


    def fill_text_input(self, field_name, input_text):
        selector = "'input[formcontrolname=" + field_name + "]'"
        commands = [
            self.wait_for(selector),
            "await page.$eval(" + selector + ", el => el.value = '" + input_text + "');\n"
        ]
        return commands

    def check_element_existence(self, element_type, element_name):
        selector = "'" + element_type + "." + element_name + "'"
        commands = [
            "if ((await page.$(" + selector + ")) !== null) {\n",
            "console.log('found " + element_type + " with name " +  element_name + "');\n",
            self.success_test(),
            "} else {\n",
            "console.log('" + element_type + " with name " +  element_name + " not found ');\n",
            self.fail_test(),
            "}\n"
        ]
        return commands

    def check_existence_by_selector(self, selector):
        commands = [
            "if ((await page.$('" + selector + "')) !== null) {\n",
            "console.log('found element with selector: " + selector + "');\n",
            self.success_test(),
            "} else {\n",
            "console.log('could not find element with selector: " + selector + "');\n",
            self.fail_test(),
            "}\n"
        ]
        return commands

    def check_element_disappear(self, selector):
        commands = [
            "if (await page.$(" + selector + ") === null) {\n",
            self.success_test(),
            "} else {\n",
            self.fail_test(),
            "}\n"
        ]

    def success_message(self):
        selector = "snack-bar-container"
        commands = [
            "// TODO: Implement interaction that leads to success message\n",
            "try {\n",
            self.wait_for(selector),
            "const snackbar = await page.$$('" + selector + "');\n",
            "if (snackbar.innerHTML.includes('erfolgreich')) {\n",
            self.success_test(),
            "} else {\n",
            self.fail_test(),
            "}\n"
            "} catch (error) {\n",
            "console.error('snackbar didnt appear', error);\n",
            self.fail_test(),
            "}\n"
        ]
        return commands

    def page_switch(self, old_url, new_url):
        commands = [
            "if (page.url() !== currentURL) {\n",
            "console.log('URL switched to' + page.url());\n",
            "currentURL = page.url();\n",
            "} else {\n",
            "console.error('page url didnt switch');\n",
            self.fail_test(),
            "}\n"
        ]
        return commands

    #def url_correct(self, url_to_check):
    #    commands = [
    #
    #    ]

    def select_dropdown_value(self, dropdown_name, value):
        selector = "'mat-select[formcontrolname=" + dropdown_name + "]'"
        return ["await page.select(" + selector + ", '" + value + "');\n"]

    def find_form(self, form_name):
        selector = "'form'"
        commands = [
            "if (await page.$(" + selector + ") !== null) {\n",
            "console.log('found form with name " + form_name + "');\n",
            self.success_test(),
            "} else {\n",
            "console.log('form with name " + form_name + " not found');\n",
            self.fail_test(),
            "}\n"
        ]
        return commands

    def select_dropdown_by_index(self, selector, index, value):
        return [
            self.wait_for(selector + ":nth-of-type(" + index + ")" ),
            "await page.select('" + selector + ":nth-of-type(" + index + ")', '" + value + "');\n"
        ]

    def select_dropdown_by_placeholder(self, selector, value):
        return [
            "// caution: Doesn't work with material select!",
            self.wait_for(selector),
            "await page.select('" + selector + "', '" + value + "');\n"
        ]


    def click_link_by_id(self, link_id):
        selector = "#" + link_id
        command = "await page.click('" + selector + "');"
        return [command + "\n"]


    def click_link_by_class(self, class_name, index):
        selector = "a." + class_name
        command = "await page.click('" + selector + "')[" + index + "];"
        return [command + "\n"]

    def count_element_quantity(self, class_name):
        selector = "." + class_name
        command = "(await page.$$('" + selector + "')).length;"
        return [command + "\n"]

    def enough_elements(self, class_name, quantity):
        selector = "." + class_name
        commands = [
            "const quantity = (await page.$$('" + selector + "')).length;\n",
            "console.log('quantity: ', quantity);\n"
            "if (quantity >= " + quantity + ") {\n",
            self.success_test(),
            "} else {\n",
            self.fail_test(),
            "}\n"
        ]
        return commands

    def check_element_html_value(self, class_name, index):
        selector = "." + class_name
        commands = [
            "page.$eval('" + selector + "', (element: any) => {\n",
            "return element.innerHTML;\n",
            "});\n"
        ]
        return commands

    def check_element_html_value_by_id(self, element_id):
        selector = "#" + element_id
        commands = [
            "page.$eval('" + selector + "', (element: any) => {\n",
            "return element.innerHTML;\n",
            "});\n"
        ]
        return commands

    # def check_elements_availability(self, class_names): TODO ??


    #def type_tags(self, tags):

    def find_element_by_html(self, element_type, html_value):
        commands = [
            "page.$eval('" + element_type + "', (elements) => {\n",
            "elements.forEach((element, index) => {\n"
            "if (element.innerHTML === '" + html_value + "') {\n",
            "console.log('Element was found');\n",
            self.success_test(),
            "break;\n"
            "} else {\n",
            "if (index === elements.length) {\n",
            self.fail_test(),
            "break;\n",
            "}\n"
            "}\n",
            "});\n",
            "});\n"
        ]
        return commands

    def lightbox_opened(self, element_class):
        return self.check_element_existence("mat-dialog", element_class)

    def wait_timer(self, timeout):
        commands = [
            "page.waitForTimeout(" + timeout + ")\n",
            ".then(() = > console.log('Waited " + timeout + " ms'));\n"
        ]
        return commands
        
    def wait_for(self, selector):
        return "await page.waitForSelector('" + selector + "');\n"

    def success_test(self):
        return "assert.strictEqual(true, true);\n"

    def fail_test(selfs):
        return "assert.strictEqual(false, true);\n"

    def open_navigation(self):
        commands = [self.click_any_button("#menuBUtton>button")]
        return commands

    def click_navigation_link(self, index):
        command = self.click_button_by_class("mat-list-item", index)
        return [command]

    def click_subnav_link(self, index):
        command = self.click_button_by_class("subMenuButton", index)
        return [command]

    def navigate_to_url(self, url):
        return ["await page.goto('" + url + "');\n"]

    def start_url(self, url):
        commands = [""]
        commands += self.navigate_to_url(url)
        commands += ["currentURL =" + url + ";\n"]
        return commands