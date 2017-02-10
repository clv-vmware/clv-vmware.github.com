---
layout: post
title: React-Redux usage 
date: 2017-02-01
categories: translation
---

## Dispatcher

Dispatcher 用来向已注册的callbacks广播payloads.它和通常的pub-sub 系统有两个区别： 

*  callbacks 并不针对特定事件注册。每个payload 都会被分发到每个已注册的callback.
*  callbacks 能够被完全或者部分推迟直到其他callback执行完成
[Dispatcher.js](https://github.com/facebook/flux/blob/master/src/Dispatcher.js)

## API

* **register(function callback): string** 注册一个callback，它会在每个payload 分发时都被触发（所以store中register 的格式会有一堆switch case）.返回一个token 可以用作waitFor()
* **unregister(string id): void** 通过register 产生的token 移除callback
* **waitFor(array<string> ids):void** 在继续执行当前callback之前等待所指定的callback触发？ 这个方法应该在响应dispatched payload的callback里被调用
* dispatch(object payload): void .向所有注册的callback dispatch payload
* isDispatching(): boolean Dispatcher 当前是否在dispatching

## Example

考虑下面这个假想的航班表格🌰，当country选定时会选定default city

```
var flightDispatcher = new Dispatcher();

// Keeps track of which country is selected
var CountryStore = {country: null};

// Keeps track of which city is selected
var CityStore = {city: null};

// Keeps track of the base flight price of the selected city
var FlightPriceStore = {price: null};
```
当一个user 变更了selected city, 发出这样的payload
```
flightDispatcher.dispatch({
  actionType: 'city-update',
  selectedCity: 'paris'
});
```
payload 被CityStore消耗

```
flightDispatcher.dispatch({
  actionType: 'city-update',
  selectedCity: 'paris'
});
```
当user 选中一个country, 分发这样一个payload

```
flightDispatcher.dispatch({
  actionType: 'country-update',
  selectedCountry: 'australia'
});
```

payload要被city country 两个store消耗
```
CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
  if (payload.actionType === 'country-update') {
    CountryStore.country = payload.selectedCountry;
  }
});
```

当更新CountryStore注册过，我们保存一个token.用这个token调用waitFor().我们需要保证countryStore 要在cityStore更新之前更新

```
CityStore.dispatchToken = flightDispatcher.register(function (payload) {
	if (payload.actionType === 'country-update') {
		flightDispatcher.waitFor([CountryStore.dispatchToken]);
		CityStore.city = getDefaultCityForCountry(CountryStore.country)
	}
})
```

waitFor() 也可以被chained
```
FlightPriceStore.dispatchToken =
  flightDispatcher.register(function(payload) {
    switch (payload.actionType) {
      case 'country-update':
      case 'city-update':
        flightDispatcher.waitFor([CityStore.dispatchToken]);
        FlightPriceStore.price =
          getFlightPriceStore(CountryStore.country, CityStore.city);
        break;
  }
});

```

country-update payload 会保证更新顺序
CountryStore, CityStore, FlightPriceStore

