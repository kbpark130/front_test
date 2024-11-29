# PowerShell 스크립트 - deploy_vue_app.ps1
# npm install -g --save-dev jest vue3-jest babel-jest @babel/preset-env @vue/test-utils

Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Minikube 시작
# minikube start --extra-config=apiserver.service-node-port-range=20000-40000
# minikube start

# vue-app 실패인 상태면
kubectl delete service vue-app
kubectl delete deployment vue-app

# Vue 앱 배포 생성
kubectl create deployment vue-app --image=kbpark130/vue-app

# Vue 앱 서비스 노출
kubectl expose deployment vue-app --type=LoadBalancer --port=8081 --name=vue-app

# Vue 앱 서비스 열기
# minikube dashboard
# minikube service vue-app

# 끝낼 때
# minikube stop
# minikube delete

