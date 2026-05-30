        new Vue({
            el: '#app',
            data() {
                return {tabIndex: 0,
                    sealName: '菱形章',
                    fontList: [
                        {name: '宋体'},
                        {name: '仿宋'},
                        {name: '楷体'},
                        {name: '黑体'},                    ],
                    // 公司
                    input01: '艾你图椭圆有限公司',
                    fontFamily01: '宋体',
                    fontSize01: 16,
                    fontWeight01: 0,
                    fontTop01: 0,
                    fontLeft01: 0,
                    fontGap01: 0,
                    // 中心内容
                    input02: '2012.01.01',
                    fontFamily02: '仿宋',
                    fontSize02: 14,
                    fontWeight02: 'bold',
                    fontTop02: 0,
                    fontLeft02: 0,
                    fontGap02: 0,
                    // 章名
                    input03: '收货专用章',
                    fontFamily03: '仿宋',
                    fontSize03: 20,
                    fontWeight03: 'bold',
                    fontTop03: 0,
                    fontLeft03: 0,
                    fontGap03: 0,
                    // 编号
                    input04: '（01）',
                    fontFamily04: '仿宋',
                    fontSize04: 15,
                    fontWeight04: 'bold',
                    fontTop04: 0,
                    fontLeft04: 0,
                    // 矩形
                    checked05: true,
                    rectWidth05: 0,
                    rectHeight05: 0,
                    rectWide05: 1,
                    rectTop05: 0,
                    rectLeft05: 0,
                    // 外边线
                    border06: 4,
                    // 印章颜色
                    color07: 'rgb(255,0,0)',
                    // 印章大小
                    sealSize: [
                        {size: 100},
                        {size: 150},
                        {size: 200},
                        {size: 300},
                        {size: 400},
                        {size: 500},
                        {size: 600},
                        {size: 700},
                    ],
                    sealSize08: 200,
                    sealScale08: 1,
                    // 印章老化
                    noisy09: 90,
                    checked09: false,
                    
                    userVipOverplus: '', // 剩余点数
                    useKtnum: 1, // 扣费点数

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
                    that.createSealEx2()
                },
                // 设置尺寸大小时，计算出相应的倍数
                sizeChange() {
                    this.sealScale08 = this.sealSize08 / 200
                    this.setChange()
                },
                // 绘制中文印章
                createSealEx2() {
                    var sealdiv = document.getElementById("sealdiv"); // 预览
                    sealdiv.innerHTML = `<div class="relative">
                            <canvas id='canvas' class='cSeal' width='${this.sealSize08}' height='${this.sealSize08}'></canvas>
                            <div class="absolute flex flex-wrap" style="user-select: none;pointer-events: none;width: 100%;height: 70%;top: 15%;z-index: 999;color: rgba(127,127,127,.4);font-size: ${16*this.sealScale08}px;">
                                <p class="whitespace-nowrap flex justify-center items-center" style="width: 50%;height: 50%;transform: rotate(45deg);">
                                    下载透明无水印
                                </p>
                                <p class="whitespace-nowrap flex justify-center items-center" style="width: 50%;height: 50%;transform: rotate(45deg);">
                                    下载透明无水印
                                </p>
                                <p class="whitespace-nowrap flex justify-center items-center" style="width: 50%;height: 50%;transform: rotate(45deg);">
                                    下载透明无水印
                                </p>
                                <p class="whitespace-nowrap flex justify-center items-center" style="width: 50%;height: 50%;transform: rotate(45deg);">
                                    下载透明无水印
                                </p>
                            </div>
                        </div>`;
                    this.createSealCN('canvas', this.input01,this.input02,this.input03,this.input04);
                },
                // 是否选择了噪点
                isnoisyRadio() {
                    this.createSealEx2()
                },
                // 提取印章颜色R,G,B值
                extractRGBValues(rgbString) {
                    const values = rgbString.match(/\d+/g); // 使用正则表达式匹配所有的数字
                    return values;
                },
                // 绘制噪点
                drawNoisy(ctx,canvas) {
                    // 选择了噪点才绘制
                    if(this.checked09){
                        // 优化后的噪点算法，仅在有颜色的部分绘制噪点。
                        // 获取canvas上的像素点颜色数据
                        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        var data = imageData.data;
                        for (var i = 0; i < data.length; i += parseInt(Math.random()*(4 + this.noisy09/10*this.sealScale08))) {
                            var r = data[i];
                            var g = data[i + 1];
                            var b = data[i + 2];
                            var a = data[i + 3];
                            // 提取印章颜色R,G,B值
                            var rgb = this.extractRGBValues(this.color07)
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
                // 中文印章
                createSealCN(id,input01,input02,input03,input04){
                    var canvas = document.getElementById("canvas");
                    var context = canvas.getContext("2d");
                    context.strokeStyle=this.color07;//设置文本颜色
                    context.textBaseline = 'middle';//设置文本的垂直对齐方式
                    context.textAlign = 'center'; //设置文本的水平对对齐方式
                    context.lineWidth = this.border06*this.sealScale08;// 菱形宽度
                    context.beginPath();
                    // 移动到第一个顶点
                    context.moveTo(5*this.sealScale08, 100*this.sealScale08);
                    context.lineTo(100*this.sealScale08, 35*this.sealScale08);
                    context.lineTo(195*this.sealScale08, 100*this.sealScale08);
                    context.lineTo(100*this.sealScale08, 165*this.sealScale08);
                    context.closePath();
                    context.stroke();
                    
                    // 绘制印章类型
                    context.font = this.fontWeight03 + ' ' + this.fontSize03*this.sealScale08 + 'px ' + this.fontFamily03;
                    context.fillStyle = this.color07;
                    context.fillText(input03,canvas.width/2+2*this.sealScale08 + this.fontLeft03,canvas.height/2+24*this.sealScale08 + this.fontTop03,80*this.sealScale08+this.fontGap03);    
                    // 绘制印章编号
                    context.font = this.fontWeight04 + ' ' + this.fontSize04*this.sealScale08 + 'px ' + this.fontFamily04;
                    context.fillText(input04,canvas.width/2+1*this.sealScale08 + this.fontLeft04,canvas.height/2+42*this.sealScale08 + this.fontTop04);    
                    context.save();
                    
                    // 绘制中心内容
                    canvas.style.letterSpacing = (this.fontGap02-2)*0.1 + 'px';
                    context.font = this.fontWeight02 + ' ' + this.fontSize02*this.sealScale08 + 'px ' + this.fontFamily02;
                    context.fillStyle = this.color07;
                    context.fillText(input02,canvas.width/2 + this.fontLeft02*this.sealScale08,canvas.height/2 + this.fontTop02*this.sealScale08);    
                    // 绘制红色矩形
                    if(this.checked05){
                        context.beginPath();
                        context.rect(canvas.width/2-38*this.sealScale08+this.rectLeft05,canvas.height/2-10*this.sealScale08+this.rectTop05, 78*this.sealScale08+this.rectWidth05, 20*this.sealScale08+this.rectHeight05);  // 定义矩形（x, y, 宽度, 高度）
                        context.lineWidth = 1+this.rectWide05*this.sealScale08;          // 设置边框宽度
                        context.stroke();               // 绘制边框
                    }
                    
                    
                    //绘制中文
                    var ccircle={
                        x:canvas.width/2,
                        y:canvas.height/2,
                        radius:59
                    };
                    var cstartAngle=153+this.fontGap01*this.sealScale08;//控制字符起始位置度数
                    var cendAngle =27-this.fontGap01*this.sealScale08;//首位字符相隔度数
                    var cradius=ccircle.radius*this.sealScale08 //圆的半径
                    var cangleDecrement=(cstartAngle-cendAngle)/(input01.length-1)//每个字母占的弧度
                    context.font = this.fontSize01*this.sealScale08 + 'px ' + this.fontFamily01
                    context.lineWidth = (1+this.fontWeight01*0.2)*this.sealScale08;
                    var cratioX = 64.5 / ccircle.radius; //横轴缩放比率
                    var cratioY = 53 / ccircle.radius; //纵轴缩放比率
                    //进行缩放（均匀压缩）
                    context.scale(cratioX, cratioY);
                    var cindex=0;
                    for(var cindex=0;cindex<input01.length;cindex++){
                        context.save()
                        context.beginPath()
                        //绘制点
                        context.translate(ccircle.x+Math.cos((Math.PI/180)*cstartAngle)*cradius-8.5*this.sealScale08 + this.fontLeft01,ccircle.y-Math.sin((Math.PI/180)*cstartAngle)*cradius+31*this.sealScale08 + this.fontTop01)
                        context.rotate((Math.PI/2)-(Math.PI/180)*cstartAngle)   //Math.PI/2为旋转90度  Math.PI/180*X为旋转多少度
                        context.fillText(input01.charAt(cindex),0,0)
                        context.strokeText(input01.charAt(cindex),0,0)
                        cstartAngle-=cangleDecrement
                        context.restore()
                    }
                    // 在绘制噪点之前，需要先恢复到之前保存的状态，否则噪点的原点将是canvas的中心点
                    context.restore();
                    this.drawNoisy(context,canvas)
                    this.dataURL = canvas.toDataURL('image/png');
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