#!/bin/bash
terraform -chdir=./terraform/exam_instance init
terraform -chdir=./terraform/exam_vpc init
npm run pm2