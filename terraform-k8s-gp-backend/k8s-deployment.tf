resource "kubernetes_deployment" "gp-backend" {
  metadata {
    name = "gp-backend"
    labels = {
      app = "gp-backend"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "gp-backend"
      }
    }
    template {
      metadata {
        labels = {
          app = "gp-backend"
        }
      }
      spec {
        container {
          name  = "gp-backend"
          image = var.docker_image
          resources {
            requests = {
              cpu    = "0.5"
              memory = "1Gi"
            }
            limits = {
              cpu    = "1.5"
              memory = "3Gi"
            }
          }
          port {
            container_port = 5000
          }
          env {
            name  = "mongoURI"
            value = var.mongoURI__env
          }
          env {
            name  = "PORT"
            value = var.port__env
          }
          env {
            name  = "JWT_SECRET"
            value = var.jwt_secret__env
          }
          env {
            name  = "AWS_ACCESS_KEY_ID"
            value = var.aws_access_key_id__env
          }
          env {
            name  = "AWS_SECRET_ACCESS_KEY"
            value = var.aws_secret_access_key__env
          }
          env {
            name  = "TF_VAR_admin_pass"
            value = var.admin_password__env
          }
        }
      }
    }
  }

}
