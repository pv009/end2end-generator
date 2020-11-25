from composer import Composer

# TODO: Correct title from DB
composer_data = {
    "filename": "123456"
}

composer = Composer(composer_data)


def main():
    composer.compose_file()


if __name__ == '__main__':
    main()
