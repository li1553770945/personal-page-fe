<template>
    <el-card id="appreciated">
        <template #header>
            <div class="card-header" style="text-align:center">
                <h3>请我喝一杯奶茶</h3>
                如果你觉得我的项目对你有帮助，你可以请我喝一杯奶茶，当然金额是无所谓的。
            </div>

        </template>
        <div id="images">
            <el-image id="image" style="width: 200px;margin: 30px; " src="http://img.peacesheep.cn/1677950486664.jpg" />
            <el-image id="image" style="width: 200px;margin: 30px;"
                src="http://img.peacesheep.cn/mm_facetoface_collect_qrcode_1677950479707.png" />
        </div>
    </el-card>
</template>

<style scoped>
#appreciated {
    margin-top: 100px;
}

#images {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>



