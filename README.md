# Text analyser
A Lambda function exercise - text analyser function.

## Getting started
* `npm run test` to run unit tests
* `npm run build` to compile & prepare a Lambda deployment bundle with `esbuild`

## Deployment
To deploy navigate to `./terraform` and `apply` different `.tfvars` files with `-var-file="dev.tfvars"` argument to use a Lambda configuration for a particular environment.