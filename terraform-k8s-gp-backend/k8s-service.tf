resource "kubernetes_service" "gp-backend" {
  metadata {
    name = "gp-backend"
  }
  spec {
    selector = {
      app = kubernetes_deployment.gp-backend.metadata.0.labels.app
    }
    port {
      port        = 443
      target_port = var.port__env
    }
    type = "LoadBalancer"
  }
}