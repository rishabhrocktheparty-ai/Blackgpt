# BLACK GPT - Deployment Guide

This guide covers deploying BLACK GPT to various environments.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Compose](#docker-compose)
3. [Kubernetes](#kubernetes)
4. [Cloud Providers](#cloud-providers)
5. [Environment Variables](#environment-variables)
6. [Database Migrations](#database-migrations)
7. [Monitoring & Logging](#monitoring--logging)

## Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL 16
- Redis 7
- npm or yarn

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/rishabhrocktheparty-ai/Blackgpt.git
   cd Blackgpt
   
   # Backend
   cd apps/backend
   npm install
   mkdir -p prisma
   cp ../../prisma/schema.prisma prisma/
   npx prisma generate
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Setup database:**
   ```bash
   # Start PostgreSQL locally or use Docker
   docker run -d \
     --name blackgpt-db \
     -e POSTGRES_USER=blackgpt \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=blackgpt \
     -p 5432:5432 \
     postgres:16-alpine
   
   # Run migrations
   cd prisma
   DATABASE_URL="postgresql://blackgpt:password@localhost:5432/blackgpt" \
     npx prisma migrate deploy
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start services:**
   ```bash
   # Terminal 1 - Backend
   cd apps/backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd apps/frontend
   npm run dev
   ```

5. **Access application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000
   - Health: http://localhost:3000/health

## Docker Compose

### Quick Start

1. **Build and start all services:**
   ```bash
   docker compose up --build
   ```

2. **Access application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

3. **View logs:**
   ```bash
   docker compose logs -f
   ```

4. **Stop services:**
   ```bash
   docker compose down
   ```

### Production Configuration

1. **Update environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Use production compose file:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. **Run database migrations:**
   ```bash
   docker compose exec backend npx prisma migrate deploy
   ```

## Kubernetes

### Prerequisites
- Kubernetes cluster (1.25+)
- kubectl configured
- Docker registry access (e.g., GitHub Container Registry)

### Deployment Steps

1. **Build and push Docker images:**
   ```bash
   # Backend
   docker build -t ghcr.io/your-org/blackgpt/backend:latest apps/backend
   docker push ghcr.io/your-org/blackgpt/backend:latest
   
   # Frontend
   docker build -t ghcr.io/your-org/blackgpt/frontend:latest apps/frontend
   docker push ghcr.io/your-org/blackgpt/frontend:latest
   ```

2. **Update Kubernetes manifests:**
   ```bash
   # Edit k8s/*.yaml files with your values
   # Update image names, secrets, domain names
   ```

3. **Deploy to Kubernetes:**
   ```bash
   # Create namespace
   kubectl apply -f k8s/namespace.yaml
   
   # Deploy database and cache
   kubectl apply -f k8s/postgres.yaml
   kubectl apply -f k8s/redis.yaml
   
   # Wait for database to be ready
   kubectl wait --for=condition=ready pod -l app=postgres -n blackgpt --timeout=300s
   
   # Deploy backend
   kubectl apply -f k8s/backend.yaml
   
   # Wait for backend to be ready
   kubectl wait --for=condition=ready pod -l app=blackgpt-backend -n blackgpt --timeout=300s
   
   # Deploy frontend
   kubectl apply -f k8s/frontend.yaml
   
   # Setup ingress (optional)
   kubectl apply -f k8s/ingress.yaml
   ```

4. **Verify deployment:**
   ```bash
   kubectl get pods -n blackgpt
   kubectl get services -n blackgpt
   kubectl logs -l app=blackgpt-backend -n blackgpt
   ```

5. **Access application:**
   ```bash
   # If using LoadBalancer
   kubectl get service blackgpt-frontend -n blackgpt
   
   # If using port-forward for testing
   kubectl port-forward -n blackgpt service/blackgpt-frontend 8080:80
   ```

### Scaling

```bash
# Scale backend
kubectl scale deployment blackgpt-backend -n blackgpt --replicas=5

# Scale frontend
kubectl scale deployment blackgpt-frontend -n blackgpt --replicas=3
```

### Updates

```bash
# Rolling update
kubectl set image deployment/blackgpt-backend \
  backend=ghcr.io/your-org/blackgpt/backend:v1.1.0 \
  -n blackgpt

# Check rollout status
kubectl rollout status deployment/blackgpt-backend -n blackgpt

# Rollback if needed
kubectl rollout undo deployment/blackgpt-backend -n blackgpt
```

## Cloud Providers

### AWS (ECS/EKS)

#### ECS with Fargate

1. **Create task definitions:**
   - Use `k8s/*.yaml` as reference
   - Configure with AWS Secrets Manager

2. **Setup RDS for PostgreSQL:**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier blackgpt-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username blackgpt \
     --master-user-password <password>
   ```

3. **Deploy to ECS:**
   - Use AWS Console or CLI
   - Configure load balancer
   - Setup auto-scaling

#### EKS

```bash
# Create cluster
eksctl create cluster --name blackgpt --region us-east-1

# Deploy using kubectl
kubectl apply -f k8s/
```

### Google Cloud (GKE)

```bash
# Create cluster
gcloud container clusters create blackgpt \
  --zone us-central1-a \
  --num-nodes 3

# Get credentials
gcloud container clusters get-credentials blackgpt

# Deploy
kubectl apply -f k8s/
```

### Azure (AKS)

```bash
# Create cluster
az aks create \
  --resource-group blackgpt-rg \
  --name blackgpt-cluster \
  --node-count 3 \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group blackgpt-rg --name blackgpt-cluster

# Deploy
kubectl apply -f k8s/
```

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis
REDIS_URL=redis://host:6379

# Security
JWT_SECRET=your-super-secret-key-change-in-production

# API Keys (for legal public sources)
OPENAI_API_KEY=sk-...
NEWS_API_KEY=...
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
TWITTER_BEARER_TOKEN=...
```

### Optional Variables

```bash
# Demo mode (disable external APIs)
DEMO_MODE=false

# Logging
LOG_LEVEL=info

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=https://yourdomain.com
```

## Database Migrations

### Development

```bash
cd prisma
npx prisma migrate dev --name migration_name
```

### Production

```bash
# Using Docker
docker compose exec backend npx prisma migrate deploy

# Using Kubernetes
kubectl exec -n blackgpt deployment/blackgpt-backend -- npx prisma migrate deploy

# Manual
cd prisma
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

### Backup

```bash
# PostgreSQL backup
pg_dump -U blackgpt -h localhost blackgpt > backup.sql

# Restore
psql -U blackgpt -h localhost blackgpt < backup.sql
```

## Monitoring & Logging

### Health Checks

```bash
# Backend health
curl http://your-domain/health

# Expected response
{"status":"healthy","timestamp":"2024-01-08T..."}
```

### Logs

```bash
# Docker Compose
docker compose logs -f backend

# Kubernetes
kubectl logs -f deployment/blackgpt-backend -n blackgpt

# View specific pod
kubectl logs -f pod/blackgpt-backend-xxx -n blackgpt
```

### Metrics

Configure Prometheus for metrics collection:

```yaml
# prometheus.yaml
scrape_configs:
  - job_name: 'blackgpt-backend'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
            - blackgpt
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: blackgpt-backend
```

### Alerts

Setup alerts for:
- High error rates
- Database connection failures
- API key exhaustion
- Suspicious input attempts (illicit source detection)

## Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS/TLS
- [ ] Setup firewall rules
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Review CORS settings
- [ ] Rotate API keys regularly
- [ ] Setup backup strategy
- [ ] Configure monitoring/alerts
- [ ] Review legal_sources.md compliance
- [ ] Test provenance validation
- [ ] Verify no dark web/Tor access

## Troubleshooting

### Database Connection Failed

```bash
# Check if database is running
kubectl get pods -n blackgpt | grep postgres

# Check connection string
kubectl exec -n blackgpt deployment/blackgpt-backend -- env | grep DATABASE_URL

# Test connection manually
kubectl exec -it -n blackgpt deployment/blackgpt-backend -- \
  psql postgresql://blackgpt:password@postgres:5432/blackgpt
```

### Backend Not Starting

```bash
# Check logs
kubectl logs -l app=blackgpt-backend -n blackgpt --tail=100

# Common issues:
# 1. Missing Prisma client - run: npx prisma generate
# 2. Migrations not applied - run: npx prisma migrate deploy
# 3. Wrong DATABASE_URL format
```

### Frontend 502 Bad Gateway

```bash
# Check if backend is healthy
curl http://blackgpt-backend.blackgpt.svc.cluster.local:3000/health

# Check nginx config
kubectl exec -it deployment/blackgpt-frontend -n blackgpt -- cat /etc/nginx/conf.d/default.conf
```

## Performance Tuning

### Database

```sql
-- Create indexes for common queries
CREATE INDEX idx_signals_status ON "Signal"(status);
CREATE INDEX idx_signals_created_at ON "Signal"("createdAt");
CREATE INDEX idx_audits_signal_id ON "Audit"("signalId");
```

### Backend

```bash
# Increase replicas
kubectl scale deployment blackgpt-backend -n blackgpt --replicas=5

# Configure resource limits
# Edit k8s/backend.yaml resources section
```

### Caching

```bash
# Use Redis for session storage and API caching
# Configure in backend environment variables
REDIS_URL=redis://redis:6379
```

## Support

For deployment issues:
- Check logs first
- Review this deployment guide
- See [README.md](../README.md) for general documentation
- Open GitHub issue with deployment details

---

**Remember**: Always verify compliance with [legal_sources.md](../legal_sources.md) before deployment. Never deploy with dark web or Tor access.
