FROM cgr.dev/chainguard/go:latest AS build

WORKDIR /src

USER root
RUN apk add --no-cache build-base ca-certificates

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./

RUN CGO_ENABLED=1 GOOS=linux go build -o /out/api ./cmd/api


FROM gcr.io/distroless/base-debian12:nonroot

WORKDIR /app

COPY --from=build /out/api /app/api

EXPOSE 8000

CMD ["/app/api"]

