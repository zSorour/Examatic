terraform {
  backend "remote" {
    organization = "demo-cloud-zsorour"
    workspaces {
      name = "example"
    }
  }
}
