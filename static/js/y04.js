        new Vue({
            el: '#app',
            data() {
                return {tabIndex: 0,
                    sealName: '圆形印章',
                    fontList: [
                        {name: '宋体'},
                        {name: '仿宋'},
                        {name: '楷体'},
                        {name: '黑体'},                    ],
                    // 公司
                    input01: '艾你图圆形印章科技有限公司',
                    fontFamily01: '宋体',
                    fontSize01: 20,
                    fontWeight01: 'bold',
                    fontGap01: 0,
                    fontBorder01: 0,
                    // 英文
                    input02: 'TESTTESTTESTTESTTESTTESTTEST',
                    fontFamily02: '宋体',
                    fontSize02: 10,
                    fontWeight02: 'bold',
                    fontBorder02: 0,
                    // 章名
                    input03: '合同专用章',
                    fontFamily03: '宋体',
                    fontSize03: 16,
                    fontWeight03: 'bold',
                    fontTop03: 0,
                    fontLeft03: 0,
                    // 中心内容
                    input04: '★',
                    fontFamily04: '宋体',
                    fontSize04: 50,
                    fontWeight04: 'bold',
                    fontTop04: 0,
                    fontLeft04: 0,
                    // 防伪码
                    input05: '',
                    fontFamily05: '楷体',
                    fontSize05: 10,
                    fontWeight05: 'bold',
                    fontGap05: 0,
                    fontRotate05: 0,
                    fontBorder05: 0,
                    // 外边线
                    border06: 2,
                    // 内边线
                    border07: 1,
                    checked07: false,
                    // 印章颜色
                    color08: 'rgb(255,0,0)',
                    // 印章大小
                    sealSize: [
                        {size: 80},
                        {size: 128},
                        {size: 160},
                        {size: 240},
                        {size: 256},
                        {size: 320},
                        {size: 480},
                        {size: 512},
                        {size: 640},
                    ],
                    sealSize09: 240,
                    sealScale09: 1.5,
                    // 印章老化
                    noisy10: 90,
                    checked10: false,
                    
                    userVipOverplus: '', // 剩余点数
                    useKtnum: 1, // 扣费点数

                    CNorEN: false, // 判断是中文或者中英文印章
                    dataURL: '',
                };
            },
            methods: {
				onTab(index){
					console.log(index)
					this.tabIndex = index 
					},
                yuebuzhu(status) {
                    if (status == 'noLogin') {
                        this.$notify.warning({
                            title: '消息提示',
                            message: '请登录后操作'
                        });
                        return
                    }
                    this.$notify.warning({
                        title: '消息提示',
                        message: '余额不足请充值'
                    });
                },
                // 设置参数时，更新canvas内容
                setChange(value) {
                    let that = this
                    console.log(value)
                    if (that.CNorEN) {
                        that.createSealEx()
                    } else {
                        that.createSealEx2()
                    }
                },
                // 设置尺寸大小时，计算出相应的倍数
                sizeChange() {
                    this.sealScale09 = this.sealSize09 / 160
                    this.setChange()
                },
                // 绘制英文印章
                createSealEx() {
                    this.CNorEN = true
                    var sealdiv = document.getElementById("sealdiv"); // 预览
                    sealdiv.innerHTML = `<canvas id='canvas' class='eSeal' width='${this.sealSize09}' height='${this.sealSize09}'></canvas>
                        <div class="absolute flex flex-wrap justify-between" style="user-select: none;pointer-events: none;width: 160px;height: auto;top: 40%;z-index: 10;">
                            <p class="text-xl" style="width: 80px;height: 60px;line-height: 60px;text-align: center;transform: rotate(45deg);color: rgba(127,127,127,.4);">
                                艾你图
                            </p>
                            <p class="text-xl whitespace-nowrap" style="width: 80px;height: 60px;line-height: 60px;text-align: center;transform: rotate(45deg);color: rgba(127,127,127,.4);">
                                下载透明无水印
                            </p>
                        </div>`;
                    this.createSeal('canvas', this.input01, this.input02,this.input03);
                },
                // 绘制中文印章
                createSealEx2() {
                    this.CNorEN = false
                    var sealdiv = document.getElementById("sealdiv"); // 预览
                    sealdiv.innerHTML = `<canvas id='canvas' class='cSeal' width='${this.sealSize09}' height='${this.sealSize09}'></canvas>
                        <div class="absolute flex flex-wrap justify-between" style="user-select: none;pointer-events: none;width: 160px;height: auto;top: 40%;z-index: 10;">
                            <p class="text-xl" style="width: 80px;height: 60px;line-height: 60px;text-align: center;transform: rotate(45deg);color: rgba(127,127,127,.4);">
                                艾你图
                            </p>
                            <p class="text-xl whitespace-nowrap" style="width: 80px;height: 60px;line-height: 60px;text-align: center;transform: rotate(45deg);color: rgba(127,127,127,.4);">
                                下载透明无水印
                            </p>
                        </div>`;
                    this.createSeal11('canvas', this.input01,this.input03);
                },
                // 是否选择了噪点
                isnoisyRadio() {
                    var cSeal = document.querySelector('.cSeal') // 中文
                    var eSeal = document.querySelector('.eSeal') // 英文
                    if (!this.checked10) { // 取消噪点时，判断预览是中文还是英文印章，再取消对应的
                        if (cSeal) {
                            this.createSealEx2()
                        } else {
                            this.createSealEx()
                        }
                    } else { // 添加噪点时，判断预览是中文还是英文印章，再添加对应的
                        if (cSeal) {
                            this.createSealEx2()
                        } else {
                            this.createSealEx()
                        }
                    }
                },
                // 提取印章颜色R,G,B值
                extractRGBValues(rgbString) {
                    const values = rgbString.match(/\d+/g); // 使用正则表达式匹配所有的数字
                    return values;
                },
                // 绘制噪点
                drawNoisy(ctx,canvas) {
                    // 选择了噪点才绘制
                    if(this.checked10){
                        // 优化后的噪点算法，仅在有颜色的部分绘制噪点。
                        // 获取canvas上的像素点颜色数据
                        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        var data = imageData.data;
                        for (var i = 0; i < data.length; i += parseInt(Math.random()*(4 + this.noisy10/10*this.sealScale09))) {
                            var r = data[i];
                            var g = data[i + 1];
                            var b = data[i + 2];
                            var a = data[i + 3];
                            // 提取印章颜色R,G,B值
                            var rgb = this.extractRGBValues(this.color08)
                            // 匹配当前canvas上存在的颜色，再进行修改
                            // 根据需要的老化效果修改像素值
                            if(r==rgb[0] && g==rgb[1] && b==rgb[2]){
                                data[i] = rgb[0];
                                data[i + 1] = rgb[1];
                                data[i + 2] = rgb[2];
                                data[i + 3] = parseInt(Math.random()*255); // 修改透明度通道
                            }
                        }
                        // 将处理过后的数据再返回到画布上
                        ctx.putImageData(imageData, 0, 0);
                    }
                },
                // 绘制中文印章
                createSeal11(id, company, name) {
                    var canvas = document.getElementById(id);
                    var context = canvas.getContext('2d');
                    
                    // 绘制印章边框
                    // 外边线
                    var width = canvas.width / 2;
                    var height = canvas.height / 2;
                    context.lineWidth = this.border06*this.sealScale09;
                    context.strokeStyle = this.color08;
                    context.beginPath();
                    context.arc(width, height, 78*this.sealScale09, 0, Math.PI * 2);
                    context.stroke();
                    context.save();
                    // 内边线
                    if(this.checked07){
                        context.lineWidth = this.border07*this.sealScale09;
                        context.strokeStyle = this.color08;
                        context.beginPath();
                        context.arc(width, height, 75*this.sealScale09, 0, Math.PI * 2);
                        context.stroke();
                        context.save();
                    }
                    
                    //画五角星
                    this.create5star(context, width, height, 25, this.color08, 0);
                    // 绘制印章类型  
                    context.font = this.fontWeight03 + ' ' + this.fontSize03*this.sealScale09 + 'px ' + this.fontFamily03
                    context.textBaseline = 'middle';//设置文本的垂直对齐方式
                    context.textAlign = 'center'; //设置文本的水平对对齐方式
                    context.lineWidth = 1;
                    context.fillStyle = this.color08;
                    context.fillText(name, width + this.fontLeft03, height + 53*this.sealScale09 + this.fontTop03);
                    // 绘制印章单位   
                    context.translate(width, height);// 平移到此位置,
                    context.save();
                    context.font = this.fontWeight01 + ' ' + this.fontSize01*this.sealScale09 + 'px ' + this.fontFamily01
                    var count = company.length;// 字数   
                    var fontGap01 = this.fontGap01>0?this.fontGap01/100:0 // 测试出来的数据 <0 就保持0.25:1的比例，>0就需要递增0.01 [0.26:1 ... 0.35:1]
                    var angle = 4 * Math.PI / (3 * (count - (1 - this.fontGap01 * (0.25 + fontGap01))));// 字间角度    0.75 <=> 5.1 调整字间距比例2.5:1
                    var chars = company.split("");
                    var c;
                    for (var i = 0; i < count; i++) {
                        c = chars[i];// 需要绘制的字符   
                        if (i == 0)
                            context.rotate((5 + this.fontGap01 / 10) * Math.PI / 6);
                        else
                            context.rotate(angle);
                        context.save();
                        context.translate(64*this.sealScale09 + this.fontBorder01, 0);// 平移到此位置,此时字和x轴垂直   
                        context.rotate(Math.PI / 2);// 旋转90度,让字平行于x轴   
                        context.fillText(c, 0, 5);// 此点为字的中心点   
                        context.restore();
                    }
                    context.restore();
                    context.rotate(13 * Math.PI / 6);
                    // 绘制印章防伪编号
                    // context.translate(width, height);
                    context.font = this.fontWeight05 + ' ' + this.fontSize05*this.sealScale09 + 'px ' + this.fontFamily05
                    var companys = this.input05
                    var counts = companys.length;// 字数   
                    var angles = -4 * Math.PI / ((8.6-this.fontGap05*0.4) * (counts - 1));// 字间角度 ----------11  0.4:0.05 [10.6:3.15]
                    var charss = companys.split("");
                    var cs;
                    for (var i = 0; i < counts; i++) {
                    	cs = charss[i];// 需要绘制的字符
                        if (i == 0){
                          context.rotate(-2 * Math.PI / 8.6);
                          context.rotate(-angles * (counts - 1) / 2);
                          context.rotate((3.4+this.fontRotate05*0.05) * Math.PI / 6); // -------------------------3.1  0.4:0.05
                        }else{
                        //   console.log('angles',angles)
                          context.rotate(angles);
                        }  
                        context.save();
                        context.translate(64*this.sealScale09 + this.fontBorder05, 0);// 平移到此位置,此时字和x轴垂直   
                        context.rotate(-90 * Math.PI / 180);// 旋转90度,让字平行于x轴  
                        context.fillText(cs, 0, 5);// 此点为字的中心点  
                        context.restore();
                    }
                    // 在绘制噪点之前，需要先恢复到之前保存的状态，否则噪点的原点将是canvas的中心点
                    context.restore();
                    this.drawNoisy(context,canvas)
                    this.dataURL = canvas.toDataURL('image/png');
                },
                // 绘制英文印章
                createSeal(id, company, ecompany, name) {
                    var canvas = document.getElementById(id);
                    var context = canvas.getContext('2d');
                    context.translate(0, 0); // 移动坐标原点 
                    // 绘制印章边框   
                    var width = canvas.width / 2;
                    var height = canvas.height / 2;
                    // 外边线
                    context.lineWidth = this.border06*this.sealScale09;
                    context.strokeStyle = this.color08;
                    context.beginPath();
                    context.arc(width, height, 78*this.sealScale09, 0, Math.PI * 2);
                    context.stroke();
                    context.save();
                    // 内边线
                    if(this.checked07){
                        context.lineWidth = this.border07*this.sealScale09;
                        context.strokeStyle = this.color08;
                        context.beginPath();
                        context.arc(width, height, 63*this.sealScale09, 0, Math.PI * 2);
                        context.stroke();
                        context.save();
                    }
                    
                    //画五角星
                    this.create5star(context, width, height, 20, this.color08, 0);
                    // 绘制印章类型
                    context.font = this.fontWeight03 + ' ' + this.fontSize03*this.sealScale09 + 'px ' + this.fontFamily03
                    context.textBaseline = 'middle';//设置文本的垂直对齐方式
                    context.textAlign = 'center'; //设置文本的水平对对齐方式
                    context.lineWidth = 1;
                    context.fillStyle = this.color08;
                    context.fillText(name, width + this.fontLeft03, height + 50*this.sealScale09 + this.fontTop03);
                    // 绘制印章中文单位   
                    context.translate(width, height);// 平移到此位置,
                    context.save(); 
                    context.font = this.fontWeight01 + ' ' + this.fontSize01*this.sealScale09 + 'px ' + this.fontFamily01
                    var count = company.length;// 字数   
                    var angle = 4 * Math.PI / (3 * (count - 1));// 字间角度    0.75 <=> 5.1 调整字间距比例2.5:1
                    var chars = company.split("");
                    var c;
                    for (var i = 0; i < count; i++) {
                        c = chars[i];// 需要绘制的字符   
                        if (i == 0)
                            context.rotate(5 * Math.PI / 6);
                        else
                            context.rotate(angle);
                        context.save();
                        // 平移到此位置,此时字和x轴垂直，第一个参数是与圆外边的距离，越大距离越近   
                        context.translate(52*this.sealScale09 + this.fontBorder01, 0);
                        context.rotate(Math.PI / 2);// 旋转90度,让字平行于x轴   
                        context.fillText(c, 0, 5);// 此点为字的中心点   
                        context.restore();
                    }
                    //绘制印章英文单位
                    context.translate(width - 80*this.sealScale09, height - 80*this.sealScale09);// 平移到此位置,
                    context.font = this.fontWeight02 + ' ' + this.fontSize02*this.sealScale09 + 'px ' + this.fontFamily02;
                    var ecount = ecompany.length;// 字数   
                    var eangle = (5 * Math.PI) / (3.34 * (ecount));// 字间角度   
                    var echars = ecompany.split("");
                    var ec;
                    for (var j = 0; j < ecount; j++) {
                        ec = echars[j];// 需要绘制的字符   
                        if (j == 0)
                            context.rotate(6.5 * Math.PI / 7 - 1);
                        else
                            context.rotate(eangle);
                        context.save();
                        // 平移到此位置,此时字和x轴垂直，第一个参数是与圆外边的距离，越大距离越近   
                        context.translate(74*this.sealScale09 + this.fontBorder02, 0);
                        context.rotate(Math.PI / 2);// 旋转90度,让字平行于x轴   
                        context.fillText(ec, 0, 4.8);// 此点为字的中心点   
                        context.restore();
                    }
                    // 绘制印章防伪编号
                    // context.translate(width, height);
                    context.font = this.fontWeight05 + ' ' + this.fontSize05*this.sealScale09 + 'px ' + this.fontFamily05
                    var companys = this.input05
                    var counts = companys.length;// 字数   
                    var angles = -4 * Math.PI / ((10-this.fontGap05*0.3) * (counts - 1));// 字间角度 ----------11  0.4:0.05 [10.6:3.15]
                    var charss = companys.split("");
                    var cs;
                    for (var i = 0; i < counts; i++) {
                    	cs = charss[i];// 需要绘制的字符
                        if (i == 0){
                            context.rotate(-2 * Math.PI / 10);
                            context.rotate(-angles * (counts - 1) / 2);
                            context.rotate((2.9 + this.fontRotate05*0.05) * Math.PI / 6); // -------------------------3.1  0.4:0.05
                        }else{
                            // console.log('angles',angles)
                            context.rotate(angles);
                        }  
                        context.save();
                        context.translate(64*this.sealScale09 + this.fontBorder05, 0);// 平移到此位置,此时字和x轴垂直   
                        context.rotate(-90 * Math.PI / 180);// 旋转90度,让字平行于x轴  
                        context.fillText(cs, 0, 5);// 此点为字的中心点  
                        context.restore();
                    }
                    // 在绘制噪点之前，需要先恢复到之前保存的状态，否则噪点的原点将是canvas的中心点
                    context.restore();
                    this.drawNoisy(context,canvas)
                    this.dataURL = canvas.toDataURL('image/png');
                },
                //绘制五角星  
                create5star(context, sx, sy, radius, color, rotato) {
                    context.save();
                    context.font = this.fontWeight04 + ' ' + this.fontSize04*this.sealScale09 + 'px ' + this.fontFamily04
                    context.fillStyle = this.color08;
                    context.fillText(this.input04, sx - 25*this.sealScale09 + this.fontLeft04,sy + 15*this.sealScale09 + this.fontTop04);
                    context.restore();
                },
                // 下载印章
                downSeal() {
                    if (this.dataURL) {
                        var a = document.createElement('a');
                        a.href = this.dataURL;
                        a.download = '印章.png';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    } else {
                        this.$message.error('请先生成印章！');
                    }
                },
            },
            mounted() {
                let that = this
                that.createSealEx2()
            }
        })