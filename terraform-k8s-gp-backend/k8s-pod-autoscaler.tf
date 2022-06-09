resource "kubernetes_horizontal_pod_autoscaler" "autoscaler" {

  metadata {
    name = "gp-backend-autoscaler"
  }
  spec {
    min_replicas = 1
    max_replicas = 10

    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = kubernetes_deployment.gp-backend.metadata.0.name
    }

    metric {
      type = "Resource"
      resource {
        name = "cpu"
        target {
          type                = "Utilization"
          average_utilization = 80
        }
      }
    }
  }
}
