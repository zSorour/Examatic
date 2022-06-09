terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.20.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.11.0"
    }
  }

  backend "s3" {
    bucket               = "186081-gp-tf-backend-state"
    workspace_key_prefix = "k8s-cluster"
    key                  = "backend-state"
    region               = "eu-central-1"
    dynamodb_table       = "186081-gp-tf-backend-state_locks"
    encrypt              = true
  }

}

provider "digitalocean" {
  token = var.digital_ocean_token__env
}

provider "kubernetes" {
  host                   = digitalocean_kubernetes_cluster.gp-k8s-cluster.endpoint
  token                  = digitalocean_kubernetes_cluster.gp-k8s-cluster.kube_config[0].token
  cluster_ca_certificate = base64decode(digitalocean_kubernetes_cluster.gp-k8s-cluster.kube_config[0].cluster_ca_certificate)
}

resource "digitalocean_kubernetes_cluster" "gp-k8s-cluster" {
  name    = "gp-k8s-cluster"
  region  = "fra1"
  version = "1.22.8-do.1"
  ha      = true
  node_pool {
    name       = "worker-pool"
    size       = "s-4vcpu-8gb-amd"
    min_nodes  = 1
    max_nodes  = 3
    auto_scale = true
  }
}
