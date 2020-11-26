
class ComponentInteraction:
    def __init__(self):
        print("initiated component interaction")

    def find_element_by_class(self, element_type, class_name, index, var_name):
        selector = element_type + "." + class_name
        command = "await page.$$('" + selector + "')[" + index + "];"
        return command + "\n"

    def find_element_by_id(self, element_id, var_name):
        selector = "#" + element_id
        command = "await page.$$('" + selector + "');"
        return command + "\n"

    def find_element_by_type(self, element_type, index, var_name):
        command = "await page.$$('" + element_type + "')[" + index + "];"
        return command + "\n"

    def click_button_by_class(self, class_name, index):
        selector = "button." + class_name
        command = "await page.click('" + selector + "')[" + index + "];"
        return command + "\n"

    def click_button_by_id(self, button_id):
        selector = "#" + button_id
        command = "await page.click('" + selector + "');"
        return command + "\n"

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
            "if (await page.$(" + selector + ") !== null) {\n",
            "console.log('found " + element_type + " with name " +  element_name + "');\n",
            "} else {\n",
            "console.log('" + element_type + " with name " +  element_name + " not found ');\n",
            "}\n"
        ]
        return commands

    def success_message(self):
        selector = "snack-bar-container"
        commands = [
            "try {\n",
            self.wait_for(selector),
            "} catch (error) {\n",
            "console.error('snackbar didn't appear', error);\n",
            "assert.equal(false, true);\n",
            "}\n"
        ]

    def page_switch(self, old_url, new_url):



    def select_dropdown_value(self, dropdown_id, value):

    def click_link_by_id(self, link_id):

    def click_link_by_class(self, class_names):

    def count_element_quantity(self, class_name):

    def check_element_html_value(self, class_name):

    def check_element_html_value_by_id(self, element_id):

    def check_elements_availability(self, class_names):

    def type_tags(self, tags):

    def find_element_by_html(self, html_value):

    def lightbox_opened(self, class_name):

    def wait_timer(self, timeout):
        commands = [
            "page.waitForTimeout(" + timeout ")\n",
            ".then(() = > console.log('Waited " + timeout + " ms'));\n"
        ]
        return commands
        
    def wait_for(self, selector):
        return "await page.waitFor(" + selector + ");\n"

