from composer import Composer
from database_connection.mongo_connector import DatabaseConnector
import subprocess

db_data = {
    "database": "e2e-generator",
    "collection": "stories"
}

db = DatabaseConnector(db_data)

def get_all_stories():
    all_stories = db.read_all()
    return all_stories

def compose_tests(stories):
    for story in stories:
        composer_data = {
            "story": stories[2]
        }
        composer = Composer(composer_data)
        composer.compose_file()


def main():
    compose_tests(get_all_stories())
    subprocess.call(['sh', './finished_tests/transfer_tests.sh'])


if __name__ == '__main__':
    main()
