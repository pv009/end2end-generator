#!/bin/sh
cd ~/Projects/e2e-generator/generator/finished_tests/
npx prettier --write ./*.ts
wait
cp -r ./*.ts ../../edecy-portal/src/e2e/tests/