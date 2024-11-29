# PowerShell 스크립트 - deploy_vue_app.ps1
# npm i -g jest
# npm install --save-dev jest vue3-jest babel-jest @babel/preset-env

Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Minikube 시작
minikube start

# Vue 앱 배포 생성
kubectl create deployment vue-app --image=kbpark130/vue-app

# Vue 앱 서비스 노출
kubectl expose deployment vue-app --type=NodePort --port=8081

# Vue 앱 서비스 열기
minikube service vue-app
