<template>
  <div>
    <span><strong>Welcome to___</strong> my first Vue project</span><br />
    <p>欢迎来到我的第一个Vue项目:电商后台管理系统</p>
  </div>
</template>

<script>
export default {
  nmae: 'Welcome',
}
</script>

<style scoped>
div {
  padding: 20px 0 0 50px;
}
span {
  font-size: 27px;
  font-weight: 700;
  margin-bottom: 30px;
}
span strong {
  font-size: 50px;
}
p {
  margin-left: 40px;
  background: #eee url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAHklEQVQImWNkYGBgYGD4//8/A5wF5SBYyAr+//8PAPOCFO0Q2zq7AAAAAElFTkSuQmCC) repeat;
  text-shadow: 1px -2px black, 5px 0px white;
  font-weight: bold;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  font-size: 27px;
}
</style>