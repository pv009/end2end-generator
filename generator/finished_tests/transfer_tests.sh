#!/bin/sh
npx prettier --write ./*.ts
wait
cp -r ./*.ts ../../edecy-portal/src/e2e/tests/