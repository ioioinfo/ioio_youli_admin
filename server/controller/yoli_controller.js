const uu_request = require('../utils/uu_request');
const uuidV1 = require('uuid/v1');
var eventproxy = require('eventproxy');
var service_info = "ioio youli service";
var youli_service = "http://211.149.248.241:17002";
var path = require('path');
var fs = require('fs');

var state_map = {
	"edit" : "新建",
	"shelve" : "上架",
	"approve" : "发布"
};
var cash_map = {
	"approve" : "已发放"
};

var banks = {
        "icbc":{"name":"中国工商银行"}
        ,"alipay":{"name":"支付宝"}
        ,"abc":{"name":"中国农业银行"}
        ,"bc":{"name":"中国银行"}
        ,"bocom":{"name":"交通银行"}
        ,"cbc":{"name":"中国建设银行"}
        ,"cib":{"name":"兴业银行"}
        ,"cmbc":{"name":"招商银行"}
        ,"cmsb":{"name":"民生银行"}
        ,"hsbc":{"name":"汇丰银行"}
};

var state = {
	"yiyuyue":"已预约",
	"wancheng":"完成",
	"shensuzhong":"申诉中",
	"yiqueren":"已确认",
	"yijujue":"已拒绝"
};

var do_get_method = function(url,cb){
	uu_request.get(url, function(err, response, body){
		if (!err && response.statusCode === 200) {
			var content = JSON.parse(body);
			do_result(false, content, cb);
		} else {
			cb(true, null);
		}
	});
};
var do_post_method = function(data,url,cb){
	uu_request.request(url, data, function(err, response, body) {
		if (!err && response.statusCode === 200) {
			do_result(false, body, cb);
		} else {
			cb(true,null);
		}
	});
};
var do_result = function(err,result,cb){
	if (!err) {
		if (result.success) {
			cb(false,result);
		}else {
			cb(true,result);
		}
	}else {
		cb(true,null);
	}
};
//登入检查
var login_check = function(data,cb){
	var url = youli_service + "/admin/login_check";
	do_post_method(data,url,cb);
};
//确认订单
var confirm_order = function(data,cb){
	var url = youli_service + "/shop/orders/shangjia_confirm";
	do_post_method(data,url,cb);
};
//项目上架
var up_project = function(data,cb){
	var url = youli_service + "/admin/project/shelve";
	do_post_method(data,url,cb);
};
//项目下架
var down_project = function(data,cb){
	var url = youli_service + "/admin/project/unshelve";
	do_post_method(data,url,cb);
};
//保存项目
var save_project = function(data,cb){
	var url = youli_service + "/admin/project/add";
	do_post_method(data,url,cb);
};
//保存更新项目
var update_project = function(data,cb){
	var url = youli_service + "/admin/project/update";
	do_post_method(data,url,cb);
};
//保存图片
var save_pictures = function(data,cb){
	var url = youli_service + "/shop/project_image/add";
	do_post_method(data,url,cb);
}
//保存删除 http://211.149.248.241:17002/shop/project_image/delete_all
var delete_pictures = function(delete_data,cb){
	var url = youli_service + "/shop/project_image/delete_all";
	do_post_method(delete_data,url,cb);
}
var get_cookie_id = function(request){
	var id;
	if (request.state && request.state.cookie) {
		var cookie = request.state.cookie;
		if (cookie.id) {
			id = cookie.id;
		}
	}
	return id;
};
//获取当前cookie 当前用户user_id 信息
var get_user_id = function(request){
	var admin_user_id;
	if (request.state && request.state.cookie) {
		var cookie = request.state.cookie;
		if (cookie.admin_user_id) {
			admin_user_id = cookie.admin_user_id;
		}
	}
	return admin_user_id;
};
//获取商家信息
var get_tenant_info = function(id,cb){
	var url = youli_service + "/shop/profile?tenant_id=" + id;
	do_get_method(url,cb);
};
//待确认信息
var daiqueren = function(user_id,cb){
	var url = youli_service + "/admin/orders/daiqueren?user_id=" + user_id;
	do_get_method(url,cb);
};
//获取商家已确认信息
var yiqueren = function(user_id,cb){
	var url = youli_service + "/admin/orders/yiqueren?user_id=" + user_id;
	do_get_method(url,cb);
};
//获取商家已完成项目
var yiwancheng = function(cb){
	var url = youli_service + "/admin/orders/yiwancheng";
	do_get_method(url,cb);
};
//获取商家已拒绝项目
var yijujue = function(cb){
	var url = youli_service + "/admin/orders/yijujue";
	do_get_method(url,cb);
};
//获取商家申诉项目
var shensuzhong = function(user_id,cb){
	var url = youli_service + "/admin/orders/is_shensu?user_id=" + user_id;
	do_get_method(url,cb);
};
//获取项目详细数量
var project_detail_number = function(user_id,cb){
	var url = youli_service + "/admin/summary?user_id=" + user_id;
	do_get_method(url,cb);
};
//获取登入用户信息
var get_login_user = function(user_id,cb){
	var url = youli_service + "/admin/user/" + user_id;
	do_get_method(url,cb);
};
//获取未上架项目信息
var unshelve_projects = function(user_id,cb){
	var url = youli_service + "/admin/unshelve_projects?user_id=" + user_id;
	do_get_method(url,cb);
};
//获取未审核项目信息
var shelve_projects = function(user_id,cb){
	var url = youli_service + "/admin/shelve_projects?user_id=" + user_id;
	do_get_method(url,cb);
};
//获取已发布项目信息
var approve_projects = function(user_id,cb){
	var url = youli_service + "/admin/approve_projects?user_id=" + user_id;
	do_get_method(url,cb);
};
//客户预约列表
var customer_order = function(user_id,cb){
	var url = youli_service + "/admin/orders/yiyuyue?user_id=" + user_id;
	do_get_method(url,cb);
};
//查看指定项目
var check_project = function(id,cb){
	var url = youli_service + "/shop/project/" + id;
	do_get_method(url,cb);
};
//查询所有商户信息
var get_tenant_infos = function(user_id,cb){
	var url = youli_service + "/admin/tenants?user_id="+user_id;
	do_get_method(url,cb);
};
//新增商户信息
var add_tenant = function(data,cb){
	var url = youli_service + "/admin/add_tenant"
	do_post_method(data,url,cb);
}
//创建商户账号
var create_account = function(data,cb){
	var url = youli_service + "/admin/tenant_user/create"
	do_post_method(data,url,cb);
}
//更新商户信息
var update_tenant = function(data,cb){
	var url = youli_service + "/admin/update_tenant"
	do_post_method(data,url,cb);
}
//查询未提现列表
var pre_get_cash = function(user_id,cb){
	var url = youli_service + "/admin/withdraw/list_all?user_id="+user_id;
	do_get_method(url,cb);
}
//查询项目明细
var find_project_detail = function(id,cb){
	var url = youli_service + "/admin/project/"+id;
	do_get_method(url,cb);
}
//改变推荐人是否有效接口
var change_recommender_valid = function(data,cb){
	var url = youli_service + "/admin/orders/change_recommender_valid"
	do_post_method(data,url,cb);
}
//提现接口
var get_cash = function(data,cb){
	var url = youli_service + "/admin/withdraw/confirm"
	do_post_method(data,url,cb);
}
//停止商户
var change_tenant_active = function(data,cb){
	var url = youli_service + "/admin/change_tenant_active"
	do_post_method(data,url,cb);
}
// 审核
var vertify = function(data,cb){
	var url = youli_service + "/admin/project/approve"
	do_post_method(data,url,cb);
}
//查询所有项目
var project_list = function(user_id,cb){
	var url = youli_service + "/admin/all_projects?user_id=" + user_id;
	do_get_method(url,cb);
};
// 更加编号得到商户
var get_tenant_by_code = function(code,cb){
	var url = youli_service + "/admin/get_tenant_by_code?code=" + code;
	do_get_method(url,cb);
};
//返利统计
var list_wancheng_subscribes = function(tenant_id,cb){
	var url = youli_service + "/bi/list_wancheng_subscribes?tenant_id=" + tenant_id;
	do_get_method(url,cb);
};
//返利统计
var list_wancheng_subscribes_date = function(tenant_id,begin_date,end_date,cb){
	var url = youli_service + "/bi/list_wancheng_subscribes?tenant_id=" + tenant_id+ "&begin_date=" +begin_date +"&end_date="+end_date;
	do_get_method(url,cb);
};
exports.register = function(server, options, next){
	var search_projects_infos = function(user_id,cb){
		var ep =  eventproxy.create("project_num_info","subscribes_num_info","withdraw_num_info","login_user"
		    ,function(project_num_info,subscribes_num_info,withdraw_num_info,login_user){
			cb(false,{"project_num_info":project_num_info,"subscribes_num_info":subscribes_num_info,"withdraw_num_info":withdraw_num_info,"login_user":login_user});
		});
		get_login_user(user_id,function(err,row){
			if (!err) {
				if (row.success) {
					var login_user = row.row;
					ep.emit("login_user", login_user);
				}else {
					ep.emit("login_user", {});
				}
			}else {
				cb(true,{"message":"search login_user wrong","service_info":service_info});
			}
		});
		project_detail_number(user_id,function(err,row){
			if (!err) {
				if (row.success) {
					var project_num_info = row.projects;
					var subscribes_num_info = row.subscribes;
					ep.emit("project_num_info", project_num_info);
					ep.emit("subscribes_num_info", subscribes_num_info);
					ep.emit("withdraw_num_info", row.withdraw);

				}else {
					ep.emit("project_num_info", {});
					ep.emit("subscribes_num_info", {});
					ep.emit("withdraw_num_info", {});
				}
			}else {
				cb(true,{"message":"search num wrong","service_info":service_info});
			}
		});
	};
	server.route([
		//停止商户
		{
			method: 'POST',
			path: '/change_tenant_active',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var id = request.payload.id;
				var is_active = request.payload.is_active;
				var data = {"user_id":user_id,"id":id,"is_active":is_active};
				change_tenant_active(data,function(err,row){
					if (!err) {
						return reply({"success":true});
					}else {
						return reply({"success":false,"message":row.message});
					}
				});
			}
		},
		//历史申述
		{
			method: 'GET',
			path: '/shenshu_history',
			handler: function(request, reply){

			}
		},
		//流水记录页面
		{
			method: 'GET',
			path: '/keep_accounts',
			handler: function(request, reply){

			}
		},
		//编号得到商户名称】
		{
			method: 'GET',
			path: '/get_tenant_by_code',
			handler: function(request, reply){
				var code = request.query.code;
				get_tenant_by_code(code,function(err,row){
					if (!err) {
						return reply({"success":true,"row":row.row});
					}else {
						return reply({"success":false,"message":row.message});
					}
				});
			}
		},
		//项目更新保存
		{
			method: 'POST',
			path: '/update_project',
			handler: function(request, reply){
				var project_infos = JSON.parse(request.payload.project_infos);
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var data = {};
				if (project_infos.fanli_fangshi == "fanli_bili") {
					project_infos.fanli_fangshi = "百分比";
				}else {
					project_infos.fanli_fangshi = "固定金额";
				}
				if (project_infos.tuijian_fanli_fangshi == "tuijian_fanli_bili") {
					project_infos.tuijian_fanli_fangshi = "百分比";
				}else {
					project_infos.tuijian_fanli_fangshi = "固定金额";
				}
				var project_data = {
					project_id : project_infos.id,
					tenant_id : project_infos.tenant_id,
                	user_id : user_id,
                	name : project_infos.name,
                	fanli_fangshi : project_infos.fanli_fangshi,
                	fanli_bili : project_infos.fanli_bili,
                	fanli_jine : project_infos.fanli_jine,
                	tuijian_fanli_fangshi : project_infos.tuijian_fanli_fangshi,
                	tuijian_fanli_bili : project_infos.tuijian_fanli_bili,
                	tuijian_fanli_jine : project_infos.tuijian_fanli_jine,
                	phone : project_infos.phone,
                	description : project_infos.description,
                	xiangmuyoushi : project_infos.xiangmuyoushi,
                	address : project_infos.address,
					price_text : project_infos.price_text
				};
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						update_project(project_data,function(err,content){
							if (!err) {
								var delete_data = {
									"project_id" : project_infos.id,
								};
								delete_pictures(delete_data,function(err,results){
									if (!err) {
										for (var i = 0; i < project_infos.images.length; i++) {
											var img_data = {};
											img_data = {
												"project_id" : project_infos.id,
												"image_src" : project_infos.images[i],
											};
											if (i==0) {
												img_data.is_main_image = 1;
											}else {
												img_data.is_main_image = 0;
											}

											save_pictures(img_data,function(err,result){
												if (!err) {

												}else {

												}
											});
										}
										return reply({"success":true,"results":results,"service_info":service_info});
									}else {
										return reply({"success":false,"results":results,"service_info":service_info,"message":results.message});
									}
								});
							}else {
								return reply({"success":false,"message":content.message,"service_info":results.service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//编辑项目
		{
			method: 'GET',
			path: '/read_project',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var id = request.query.id;
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						find_project_detail(id,function(err,row){
							if (!err) {
								var images = row.project.images;
								var images_url = [];
								for (var i = 0; i < images.length; i++) {
									images_url.push(images[i].url);
								}
								return reply.view("read_project",{"success":true,"message":"ok","row":row.project,"results":results,"images_url":images_url});
							}else {
								return reply({"success":false,"message":result.message});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//编辑项目
		{
			method: 'GET',
			path: '/edit_project',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var id = request.query.id;
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						find_project_detail(id,function(err,row){
							if (!err) {
								var images = row.project.images;
								var images_url = [];
								for (var i = 0; i < images.length; i++) {
									images_url.push(images[i].url);
								}
								return reply.view("edit_project",{"success":true,"message":"ok","row":row.project,"results":results,"images_url":JSON.stringify(images_url)});
							}else {
								return reply({"success":false,"message":result.message});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//查询项目明细
		{
			method: 'GET',
			path: '/find_project_detail',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var id = request.query.id;
				if (!id) {
					return reply({"success":false,"message":"param wrong"});
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						find_project_detail(id,function(err,row){
							if (!err) {
								return reply({"success":true,"message":"ok","row":row.project});
							}else {
								return reply({"success":false,"message":result.message});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//推荐人有效的 接口
		{
			method: 'POST',
			path: '/change_recommender_valid',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var is_valid = request.payload.is_valid;
				if (!is_valid) {
					return reply({"success":false,"message":"params wrong"});
				}
				var id = request.payload.id;
				var data = {"id":id,"user_id":user_id,"is_valid":is_valid};
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						change_recommender_valid(data,function(err,result){
							if (!err) {
								return reply({"success":true,"message":"ok"});
							}else {
								return reply({"success":false,"message":result.message});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//管理员项目列表 project_list
		{
			method: 'GET',
			path: '/',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						project_list(user_id,function(err,rows){
							if (!err) {
								return reply.view("project_list",{"rows":rows.rows,"results":results,"state_map":state_map});
							}else {
								return reply({"success":false,"message":rows.message,"results":results,"service_info":rows.service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//审核
		{
			method: 'POST',
			path: '/vertify',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var data = {};
				data.project_id = request.payload.project_id;
				data.user_id = user_id;
				vertify(data, function(err,rows){
					if (!err) {
						if (rows.success) {
							return reply({"success":true,"service_info":service_info});
						}else {
							return reply({"success":false,"message":rows.message,"service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":rows.message,"service_info":service_info});
					}
				});
			}
		},
		//提现接口
		{
			method: 'POST',
			path: '/get_cash',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var id = request.payload.id;
				if (!id) {
					return reply({"success":false,"message":"id is null"});
				}
				var data = {"user_id":user_id,"id":id};
				get_cash(data,function(err,result){
					if (!err) {
						return reply({"success":true,"service_info":service_info});
					}else {
						return reply({"success":false,"message":result.message,"service_info":service_info});
					}
				});
			}
		},
		//查询未提现列表
		{
			method: 'GET',
			path: '/pre_get_cash',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						pre_get_cash(user_id,function(err,rows){
							if (!err) {
								var data = rows.rows;
								for (var i = 0; i < data.length; i++) {
									data[i].card_type = banks[data[i].card_type]["name"];
								}
								return reply.view("pre_get_cash",{"rows":data,"results":results,"service_info":service_info,"cash_map":cash_map});
							}else {
								return reply({"success":false,"message":rows.message,"service_info":results.service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//修改商户
		{
			method: 'GET',
			path: '/update_tenant',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var data = request.query.data;
				data = JSON.parse(data);
				data.user_id = user_id;
				update_tenant(data,function(err,result){
					if (!err) {
						if (result.success) {
							return reply({"success":true,"message":"ok"});
						}else {
							return reply({"success":false,"message":result.message});
						}
					}else {
						return reply({"success":false,"message":result.message});
					}
				});
			}
		},
		//新增商户
		{
			method: 'GET',
			path: '/add_tenant',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var data = request.query.data;
				data = JSON.parse(data);
				data.user_id = user_id;
				add_tenant(data,function(err,result){
					if (!err) {
						if (result.success) {
							var info = {
								"username" : "admin",
								"name" : data.name,
								"password" : 123456,
								"tenant_id" :result.id,
								"is_system" : 1
							};
							create_account(info,function(err,row){
								if (!err) {
									return reply({"success":true,"message":"ok","id":result.id});
								}else {
									return reply({"success":false,"message":row.message});
								}
							});
							return reply({"success":true,"message":"ok","id":result.id});
						}else {
							return reply({"success":false,"message":result.message});
						}
					}else {
						return reply({"success":false,"message":result.message});
					}
				});
			}
		},
		//查询所有商户信息
		{
			method: 'GET',
			path: '/tenant_infos',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						get_tenant_infos(user_id,function(err,rows){
							if (!err) {
								if (rows.success) {
									return reply.view("tenant_list",{"success":true,"message":"ok","rows":rows.rows,"results":results,"projects":JSON.stringify(rows.rows)});
								}else {
									return reply({"success":false,"message":rows.message});
								}
							}else {
								return reply({"success":false,"message":rows.message});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//查询用户admin信息  新 管理员修改账户信息接口
		{
			method: 'GET',
			path: '/admin_info',
			handler: function(request, reply){

			}
		},

		//后台店家登入接口
		{
			method: 'GET',
			path: '/login',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					cookie_id = uuidV1();
				}
				var cookie = request.state.cookie;
				if (!cookie) {
					cookie = {};
				}
				cookie.cookie_id = cookie_id;
				return reply.view("pc_login").state('cookie', cookie, {ttl:10*365*24*60*60*1000});
			}
		},
		//后台管理
		{
			method: 'GET',
			path: '/background',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						return reply.view("background_management",{"results":results});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//登入验证
		{
			method: 'POST',
			path: '/do_login',
			handler: function(request, reply){
				var data = {};
				data.username = request.payload.username;
				data.password = request.payload.password;
				login_check(data, function(err,row){
					if (!err) {
						var admin_user_id = row.user_id;
						var cookie = request.state.cookie;
						if (!cookie) {
							return reply({"success":false});
						}
						cookie.admin_user_id = admin_user_id;
						return reply({"success":true,"service_info":service_info,"service_info":service_info}).state('cookie', cookie, {ttl:10*365*24*60*60*1000});
					}else {
						return reply({"success":false,"service_info":service_info,"message":row.message});
					}
				});
			}
		},
		//商家信息
		{
			method: 'GET',
			path: '/tenant_info',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				get_tenant_info(id, function(err,row){
					if (!err) {
						if (row.success) {
							return reply({"success":true,"tenant_info":row.row,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//返利列表信息
		{
			method: 'GET',
			path: '/project_order_infos',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				daiqueren(user_id, function(err,rows){
					if (!err) {
						if (rows.success) {
							return reply({"success":true,"order_infos":rows.rows,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//未上架项目列表
		{
			method: 'GET',
			path: '/unshelve_projects',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						var ep =  eventproxy.create("projects","tenants","results",function(projects,tenants,results){
							var tenants_map = {};
							for (var i = 0; i < projects.length; i++) {
								for (var j = 0; j < tenants.length; j++) {
									if (projects[i].tenant_id == tenants[j].id) {
										tenants_map[projects[i].tenant_id] = tenants[j];
									}
								}
							}
							return reply.view("unshelve_projects",{"rows":projects,"results":results,"tenants_map":tenants_map,"service_info":service_info});
						});

						ep.emit("results", results);

						unshelve_projects(user_id, function(err,rows){
							if (!err) {
								var projects = rows.rows;
								ep.emit("projects", projects);
							}else {
								ep.emit("projects", []);
							}
						});

						get_tenant_infos(user_id,function(err,rows){
							if (!err) {
								var tenants = rows.rows;
								ep.emit("tenants", tenants);
							}else {
								ep.emit("tenants", []);
							}
						});

					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//未审核项目列表
		{
			method: 'GET',
			path: '/shelve_projects',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {

						var ep =  eventproxy.create("projects","tenants","results",function(projects,tenants,results){
							var tenants_map = {};
							for (var i = 0; i < projects.length; i++) {
								for (var j = 0; j < tenants.length; j++) {
									if (projects[i].tenant_id == tenants[j].id) {
										tenants_map[projects[i].tenant_id] = tenants[j];
									}
								}
							}
							return reply.view("shelve_projects",{"rows":projects,"results":results,"tenants_map":tenants_map,"service_info":service_info});
						});

						ep.emit("results", results);

						shelve_projects(user_id, function(err,rows){
							if (!err) {
								var projects = rows.rows;
								ep.emit("projects", projects);
							}else {
								ep.emit("projects", []);
							}
						});

						get_tenant_infos(user_id,function(err,rows){
							if (!err) {
								var tenants = rows.rows;
								ep.emit("tenants", tenants);
							}else {
								ep.emit("tenants", []);
							}
						});

					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//已发布项目列表
		{
			method: 'GET',
			path: '/approve_projects',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {

						var ep =  eventproxy.create("projects","tenants","results",function(projects,tenants,results){
							var tenants_map = {};
							for (var i = 0; i < projects.length; i++) {
								for (var j = 0; j < tenants.length; j++) {
									if (projects[i].tenant_id == tenants[j].id) {
										tenants_map[projects[i].tenant_id] = tenants[j];
									}
								}
							}
							return reply.view("approve_projects",{"rows":projects,"results":results,"tenants_map":tenants_map,"service_info":service_info});
						});

						ep.emit("results", results);

						approve_projects(user_id, function(err,rows){
							if (!err) {
								var projects = rows.rows;
								ep.emit("projects", projects);
							}else {
								ep.emit("projects", []);
							}
						});

						get_tenant_infos(user_id,function(err,rows){
							if (!err) {
								var tenants = rows.rows;
								ep.emit("tenants", tenants);
							}else {
								ep.emit("tenants", []);
							}
						});

					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//客户已预约列表
		{
			method: 'GET',
			path: '/customer_order',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						customer_order(user_id, function(err,rows){
							if (!err) {
								if (rows.success) {
									for (var i = 0; i < rows.rows.length; i++) {
										var project = rows.rows[i];
										if (project.recommender_wx_user) {
											if (project.wx_user) {
												project.wx_user.mobile  = project.wx_user.mobile.substring(0,project.wx_user.mobile.length-2)+"**";
											}
										}
										// if (project.recommender_wx_user) {
										// 	if (project.recommender_valid != 1) {
										// 		project.recommender_wx_user.mobile = project.recommender_wx_user.mobile.substring(0,project.recommender_wx_user.mobile.length-2)+"**";
										// 	}
										// }
									}
									return reply.view("customer_order",{"rows":rows.rows,"results":results,"service_info":service_info});
								}else {
									return reply({"success":false,"message":"search wrong","service_info":service_info});
								}
							}else {
								return reply({"success":false,"message":"search wrong","service_info":service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//商家待确认列表
		{
			method: 'GET',
			path: '/daiqueren',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						daiqueren(user_id, function(err,rows){
							if (!err) {
								if (rows.success) {

									return reply.view("daiqueren",{"rows":rows.rows,"results":results,"service_info":service_info});
								}else {
									return reply({"success":false,"message":"search wrong","service_info":service_info});
								}
							}else {
								return reply({"success":false,"message":"search wrong","service_info":service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//商家已确认
		{
			method: 'GET',
			path: '/yiqueren',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						yiqueren(user_id, function(err,rows){
							if (!err) {
								if (rows.success) {
									return reply.view("yiqueren",{"rows":rows.rows,"results":results,"service_info":service_info});
								}else {
									return reply({"success":false,"message":"search wrong","service_info":service_info});
								}
							}else {
								return reply({"success":false,"message":"search wrong","service_info":service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//商家已完成列表
		{
			method: 'GET',
			path: '/yiwancheng',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}

				search_projects_infos(user_id,function(err,results){
					if (!err) {
						yiwancheng(function(err,rows){
							if (!err) {
								if (rows.success) {
									return reply.view("yiwancheng",{"rows":rows.rows,"results":results,"service_info":service_info});
								}else {
									return reply({"success":false,"message":"search wrong","service_info":service_info});
								}
							}else {
								return reply({"success":false,"message":"search wrong","service_info":service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//商家已拒绝列表
		{
			method: 'GET',
			path: '/yijujue',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}

				search_projects_infos(user_id,function(err,results){
					if (!err) {
						yijujue(function(err,rows){
							if (!err) {
								if (rows.success) {
									return reply.view("yijujue",{"rows":rows.rows,"results":results,"service_info":service_info});
								}else {
									return reply({"success":false,"message":"search wrong","service_info":service_info});
								}
							}else {
								return reply({"success":false,"message":"search wrong","service_info":service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//商家申诉列表
		{
			method: 'GET',
			path: '/shensuzhong',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						shensuzhong(user_id, function(err,rows){
							if (!err) {
								if (rows.success) {
									for (var i = 0; i < rows.rows.length; i++) {
										rows.rows[i].state = state[rows.rows[i].state];
									}
									return reply.view("shensuzhong",{"rows":rows.rows,"results":results,"service_info":service_info});
								}else {
									return reply({"success":false,"message":"search wrong","service_info":service_info});
								}
							}else {
								return reply({"success":false,"message":"search wrong","service_info":service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//返利统计
		{
			method: 'GET',
			path: '/fanli_tongji',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var tenant_id = request.query.tenant_id;
				var begin_date = request.query.begin_date;
				var end_date = request.query.end_date;
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						if (!tenant_id) {
							return reply.view("fanli_tongji",{"rows":[],"service_info":service_info,"results":results});
						}else if(!begin_date||!end_date) {
							list_wancheng_subscribes(tenant_id,function(err,rows){
								if (!err) {
									var total_amount = 0;
									var total_tuijian = 0;
									for (var i = 0; i < rows.length; i++) {
										total_amount = total_amount + rows[i].shiji_fanli_amount;
										total_tuijian = total_tuijian + rows[i].shiji_tuijian_fanli_amount;
									}
									return reply.view("fanli_tongji",{"rows":rows.rows,"service_info":service_info,"results":results});
								}else {
									return reply({"success":false,"message":rows.message,"service_info":results.service_info});
								}
							});
						}else {
							list_wancheng_subscribes_date(tenant_id,begin_date,end_date,function(err,rows){
								if (!err) {
									return reply.view("fanli_tongji",{"rows":rows.rows,"service_info":service_info,"results":results});
								}else {
									return reply({"success":false,"message":rows.message,"service_info":results.service_info});
								}
							});
						}
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//商家信息
		{
			method: 'GET',
			path: '/tenant',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						get_tenant_info(id, function(err,row){
							if (!err) {
								if (row.success) {
									return reply.view("tenant",{"row":row.row,"results":results,"service_info":service_info});
								}else {
									return reply({"success":false,"message":"search wrong","service_info":service_info});
								}
							}else {
								return reply({"success":false,"message":"search wrong","service_info":service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//项目新增
		{
			method: 'GET',
			path: '/add_project',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						return reply.view("add_project",{"results":results,"service_info":service_info});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//清空cookie 退出
		{
			method: 'GET',
			path: '/logout',
			handler: function(request, reply){
				var cookie = request.state.cookie;
				delete cookie.admin_user_id;
				return reply.redirect("/login").state('cookie',cookie,{});
			}
		},
		//商家已确认
		{
			method: 'GET',
			path: '/make_sure_infos',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				yiqueren(user_id, function(err,rows){
					if (!err) {
						if (rows.success) {
							return reply({"success":true,"make_sure_infos":rows.rows,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//商家已完成列表
		{
			method: 'GET',
			path: '/finish_project_infos',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				yiwancheng(id, function(err,rows){
					if (!err) {
						if (rows.success) {
							return reply({"success":true,"finish_project_infos":rows.rows,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//商家申诉列表
		{
			method: 'GET',
			path: '/appeal_project_infos',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				shensuzhong(user_id, function(err,rows){
					if (!err) {
						if (rows.success) {
							return reply({"success":true,"appeal_project_infos":rows.rows,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//项目保存
		{
			method: 'POST',
			path: '/save_project',
			handler: function(request, reply){
				var project_infos = JSON.parse(request.payload.project_infos);
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var data = {};
				if (project_infos.fanli_fangshi == "fanli_bili") {
					project_infos.fanli_fangshi = "百分比";
				}else {
					project_infos.fanli_fangshi = "固定金额";
				}
				if (project_infos.tuijian_fanli_fangshi == "tuijian_fanli_bili") {
					project_infos.tuijian_fanli_fangshi = "百分比";
				}else {
					project_infos.tuijian_fanli_fangshi = "固定金额";
				}
				var project_data = {
					tenant_id : project_infos.id,
                	user_id : user_id,
                	name : project_infos.name,
                	fanli_fangshi : project_infos.fanli_fangshi,
                	fanli_bili : project_infos.fanli_bili,
                	fanli_jine : project_infos.fanli_jine,
                	tuijian_fanli_fangshi : project_infos.tuijian_fanli_fangshi,
                	tuijian_fanli_bili : project_infos.tuijian_fanli_bili,
                	tuijian_fanli_jine : project_infos.tuijian_fanli_jine,
                	phone : project_infos.phone,
                	description : project_infos.description,
                	xiangmuyoushi : project_infos.xiangmuyoushi,
                	address : project_infos.address,
					price_text : project_infos.price_text
				};
				search_projects_infos(user_id,function(err,results){
					if (!err) {
						save_project(project_data,function(err,content){
							if (!err) {
								for (var i = 0; i < project_infos.images.length; i++) {
									var img_data = {};
									img_data = {
										"project_id" : content.project_id,
										"image_src" : project_infos.images[i],
									};
									if (i==0) {
										img_data.is_main_image = 1;
									}else {
										img_data.is_main_image = 0;
									}
									save_pictures(img_data,function(err,result){
										if (!err) {

										}else {

										}
									});
								}
								return reply({"success":true,"results":results,"code":content.code,"service_info":service_info});
							}else {
								return reply({"success":false,"message":content.message,"service_info":results.service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//商家项目查看
		{
			method: 'GET',
			path: '/check_project',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				var id = request.query.id;
				check_project(id, function(err,row){
					if (!err) {
						if (row.success) {
							return reply({"success":true,"project_info":row.project,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//查看项目数量
		{
			method: 'GET',
			path: '/project_detail_number',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				var id = cookie_id;
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				project_detail_number(user_id, function(err,row){
					if (!err) {
						if (row.success) {
							return reply({"success":true,"project_info":row.projects,"subscribes_info":row.subscribes,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//商家确认接口
		{
			method: 'POST',
			path: '/confirm_order',
			handler: function(request, reply){
				var data = {};
				data.project_subscribe_id = request.payload.project_subscribe_id;
				data.contract_amount = request.payload.contract_amount;
				confirm_order(data, function(err,rows){
					if (!err) {
						if (rows.success) {
							return reply({"success":true,"service_info":service_info});
						}else {
							return reply({"success":false,"message":rows.message,"service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"operation wrong","service_info":service_info});
					}
				});
			}
		},
		//商品上架
		{
			method: 'POST',
			path: '/up_project',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var data = {};
				data.project_id = request.payload.project_id;
				data.user_id = user_id;
				up_project(data, function(err,rows){
					if (!err) {
						if (rows.success) {
							return reply({"success":true,"service_info":service_info});
						}else {
							return reply({"success":false,"message":rows.message,"service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":rows.message,"service_info":service_info});
					}
				});
			}
		},
		//商品下架
		{
			method: 'POST',
			path: '/down_project',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var data = {};
				data.project_id = request.payload.project_id;
				data.user_id = user_id;
				down_project(data, function(err,rows){
					if (!err) {
						if (rows.success) {
							return reply({"success":true,"service_info":service_info});
						}else {
							return reply({"success":false,"message":rows.message,"service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"operation wrong","service_info":service_info});
					}
				});
			}
		},
		//添加项目图片
		{
			method: 'GET',
			path: '/add_picture',
			handler: function(request, reply){
				var data = {};
				// data.project_id = request.payload.project_id;
				data.project_id = 7;
				data.image_src = "";
				data.is_main_image = 0;
				down_project(data, function(err,rows){
					if (!err) {
						if (rows.success) {
							return reply({"success":true,"service_info":service_info});
						}else {
							return reply({"success":false,"message":rows.message,"service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"operation wrong","service_info":service_info});
					}
				});
			}
		},
		//登入后一个页面
		{
			method: 'GET',
			path: '/upload',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				return reply.view("upload");
			}
		},

		//处理上传文件
		{
			method: 'POST',
			path: '/do_upload',
			config: {
				payload: {
				   output: 'file',
				   maxBytes: 209715200,
				   parse: true //or just remove this line since true is the default
				},
				handler:function (request, reply) {
					var filepath = request.payload.files.path;
					var out_name = path.extname(request.payload.files.filename);
					fs.readFile(filepath, function (err, data) {
						var filename = uuidV1() + out_name;
						var newPath = "public/images/" +filename;
						// var newPath = __dirname + '/' + filename;
						fs.writeFile(newPath, data, function (err) {
							return reply({"src":filename});
						});
					});
				}
			},
		},

	]);

    next();
};

exports.register.attributes = {
    name: 'yoli_controller'
};
