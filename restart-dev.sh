#!/bin/bash
lsof -ti:5173 | xargs -r kill -9
npm -w apps/web run dev &
