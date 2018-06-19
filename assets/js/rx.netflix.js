// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function()
{
	var yuiUse = Rx.Observable.yui3Use = function(what) 
	{
		return Rx.Observable.create(function(observer)
		{			
			var handler = function(y)
			{
				observer.onNext(y);
			};
			var u = YUI().use(what, handler);
			return function(){};
		});
	};
	var fromYUIEvent = Rx.Observable.fromYUI3Event = function(selector, eventType) 
	{
	    return yuiUse("node-base").selectMany(function(y)
	    {
		    return Rx.Observable.create(function(observer)
		    {
	        	var handler = function(eventObject) 
		        {
		            observer.onNext(eventObject);
	        	};
		        y.on(eventType, handler, selector);
		        return function() 
	        	{
		            y.detach(eventType, handler, selector);
		        };
		    });
	    });	
	};
	
	var fromYUI3IO = Rx.Observable.fromYUI3IO = function(uri, config) {
	    return yuiUse("io-base").selectMany(function(y) {
	        var internalConfig = {};
		for (var k in config) {
		    internalConfig[k] = config[k];
                }
	    
	        var subject = new Rx.AsyncSubject();
	        
	        internalConfig.on = {
	        	success : function(transactionid, response, args) {
	            		  	subject.onNext({ transactionid : transactionid, response : response, arguments : args});
	            			subject.onCompleted();
                		  },
                
                	failure : function(transactionid, response, args) {
	                          	subject.onError({ transactionid : transactionid, response : response, arguments : args});
                        	  }
                };
                
                y.io(uri, internalConfig);
                
                return subject;
	    });
	};
})();
