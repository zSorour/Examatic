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
}

provider "digitalocean" {
  token = var.digital_ocean_token
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

  node_pool {
    name       = "worker-pool"
    size       = "s-2vcpu-4gb"
    node_count = var.node_count
  }
}
