#!/bin/bash

cd app_one
pnpm dev &
cd ../app_two
pnpm dev &
