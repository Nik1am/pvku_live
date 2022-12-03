	let b11 = t2u("08:00:00")
	let l11 = t2u("09:20:00")
	let b12 = t2u("09:30:00")
	let l12 = t2u("10:50:00")
	let b13 = t2u("11:10:00")
	let l13 = t2u("12:30:00")
	let b14 = t2u("12:40:00")
	let l14 = t2u("14:00:00")

	let b21 = t2u("12:40:00")
	let l21 = t2u("14:00:00")
	let b22 = t2u("14:10:00")
	let l22 = t2u("15:30:00")
	let b23 = t2u("15:30:00")
	let l23 = t2u("17:05:00")
	let b24 = t2u("17:15:00")
	let l24 = t2u("18:35:00")
	var debugoffset = 0
	var storage = window.localStorage;
	// [день[группа[массив расписания]]]
	var shedule = csv2json
	var title_str = ""
	//Скрытие кнопок при переходе в полноэкранный режим
	window.onresize = function(){
		hof = document.getElementsByClassName("hide-on-fullscreen")
			if( isFullScreen()) {
				for (i=0; i<hof.length; i++) {
    				hof[i].style.top = '-4em';
				}
			}
			else {
				for (i=0; i<hof.length; i++) {
    				hof[i].style.top = '0';
				}
			}
		};
	// Реакция на двойное нажатие по экрану
	document.addEventListener('dblclick', (e) => {
		toggleFullScreen()
	});
    function rainbow() {
        document.getElementsByClassName('bg')[0].style.animation = "rainbow 2s infinite"
    }
    function unrainbow() {
        document.getElementsByClassName('bg')[0].style.animation = "none"
    }
	// Функция входа/выхода из полноэкранного режима (украл из интернета)
	function toggleFullScreen() {
       if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
         if (document.documentElement.requestFullscreen) {
           document.documentElement.requestFullscreen();
         } else if (document.documentElement.mozRequestFullScreen) {
           document.documentElement.mozRequestFullScreen();
         } else if (document.documentElement.webkitRequestFullscreen) {
           document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
         }
       } else {
          if (document.cancelFullScreen) {
             document.cancelFullScreen();
          } else if (document.mozCancelFullScreen) {
             document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          }
       }
     }
	window.onload = function() {
		// Функция смены степени размытия фона
		var bs = document.getElementById('blur-slider')
		bs.oninput = function() {
			document.getElementsByClassName('bg')[0].style.filter = `blur(${bs.value}px)`;
			storage.setItem('blur_strength',bs.value);
		}
		// Функция смена группы
		var gs = document.getElementById('group-selector')

		for (var i = 0; i<shedule.length; i++){
    		var opt = document.createElement('option');
    		opt.value = i;
    		opt.innerHTML = shedule[i][0];
    		gs.appendChild(opt);
		}

		gs.onchange = function() {
			storage.setItem('group_id',gs.value);
			writeSchedule(gs.value)
		};
		
		// Проверка заполнена ли ячейка с ссылкой на изображение фона, если нет - ставит стандартный
		if(storage.getItem('bgurl') != null){
			document.getElementsByClassName('bg')[0].style.backgroundImage = "url("+storage.getItem('bgurl')+")";
			document.getElementById("bg-preview").src = storage.getItem('bgurl');
		} else {
			storage.setItem('bgurl',"https://i.pinimg.com/736x/db/86/4f/db864f597a08dc61666c9cee0b711972.jpg");
			document.getElementsByClassName('bg')[0].style.backgroundImage = "url("+storage.getItem('bgurl')+")";
		}

		// Проверка выбрана ли группа, если нет - то выставляет id 0
		if(storage.getItem('group_id') != null){
			gs.selectedIndex = storage.getItem('group_id');
			writeSchedule(storage.getItem('group_id'));
		} else {
			storage.setItem('group_id',0);
		}

		// Проверка заполнена ли ячейка с значением размытия фона, если нет - то ставит 5 (px)
		if(storage.getItem('blur_strength') != null){
			document.getElementsByClassName('bg')[0].style.filter = `blur(${storage.getItem('blur_strength')}px)`
		} else {
			storage.setItem('blur_strength',5);
		}

		// Проверка заполнены ли ячейки с значением цветов, если нет - то ставит стандартные
		if(storage.getItem('accent_color') != null){
			document.querySelector(":root").style.setProperty('--accent-color', storage.getItem('accent_color'))
		} else {
			storage.setItem('accent_color', "#FFFFFF");
		}
		if(storage.getItem('bg_color') != null){
			document.querySelector(":root").style.setProperty('--bg-color', storage.getItem('bg_color'))
		} else {
			storage.setItem('bg_color', "rgba(0,0,0,0.5)");
		}
		if(storage.getItem('text_color') != null){
			document.querySelector(":root").style.setProperty('--text-color', storage.getItem('text_color'))
		} else {
			storage.setItem('text_color', "#FFFFFF");
		}

		// Функции смены цветов
		btnColorAccent = document.getElementById("btn-color-accent")
		colorAccent = document.getElementById("color-accent")
		btnColorAccent.onclick = () => {
			root = document.querySelector(":root")
			root.style.setProperty('--accent-color', colorAccent.value)
			storage.setItem('accent_color',colorAccent.value);
		}

		btnColorBg = document.getElementById("btn-color-bg")
		colorBg = document.getElementById("color-bg")
		colorBgAlpha = document.getElementById("color-bg-alpha")
		btnColorBg.onclick = () => {
			root = document.querySelector(":root")
			r = parseInt(colorBg.value.slice(-6, -4), 16)
			g = parseInt(colorBg.value.slice(-4, -2), 16)
			b = parseInt(colorBg.value.slice(-2), 16)
			a = colorBgAlpha.value
			rgba = 'rgba('+r+','+g+','+b+','+a+')'
			root.style.setProperty('--bg-color', rgba)
			storage.setItem('bg_color',rgba);
		}
		
		btnColorText = document.getElementById("btn-color-text")
		colorText = document.getElementById("color-text")
		btnColorText.onclick = () => {
			root = document.querySelector(":root")
			root.style.setProperty('--text-color', colorText.value)
			storage.setItem('text_color',colorText.value);
		}

		// Функционал смены фона v2
		bgFile = document.getElementById("bg-file");
		bgURL = document.getElementById("bg-url");
		bgBtn = document.getElementById("bg-btn");
		bgPreview = document.getElementById("bg-preview");
		var tempImageData;
		var reader = new FileReader();
		bgFile.onchange = () => {
        	reader.readAsDataURL(bgFile.files[0]); 
        	reader.onload = () => {
            	tempImageData = reader.result;
				bgPreview.src = tempImageData;
        	}
    	}
		bgURL.onblur = () => {
			if(bgURL.value){
				bgPreview.src = bgURL.value;
			}
		}
		bgBtn.onclick = () => {
			if(bgURL.value){
				bgPreview.src = bgURL.value;
				document.getElementsByClassName('bg')[0].style.backgroundImage = "url("+bgURL.value+")"; 
				storage.setItem('bgurl',bgURL.value);
			}
			else if(bgFile.value){
				bgPreview.src = tempImageData;
				document.getElementsByClassName('bg')[0].style.backgroundImage = "url("+tempImageData+")"; 
				storage.setItem('bgurl',tempImageData);
			}
			else{
				alert("Для смены фона выберите хотя-бы 1 вариант")
			}
		}

		// Запуск часов
		var x = setInterval(update, 1000)
	}
	// Функция проверки открыт ли сайт во весь экран
	function isFullScreen() {
		return window.innerHeight == screen.height
	}
	// Функция написания расписания по id группы
	function writeSchedule(group_id) {
		var weekday = new Date().getDay()
		if (weekday == 0) {
			weekday = 7;
		}
		var temp = "";
		for (let i = 0; i < 4; i++) {
			para_name = shedule[group_id][weekday].split(";")[i]
			if (para_name){
				document.getElementsByClassName('lecture')[i].innerHTML = para_name
			}
			else {
				document.getElementsByClassName('lecture')[i].innerHTML = ""
			}
		}
	}

	// Функция смены фона [УСТАРЕЛА]
	/*function changeBG() {
		var url = prompt('Ссылка на файл фона',storage.getItem('bgurl'))
		if(url != null){
			document.getElementsByClassName('bg')[0].style.backgroundImage = "url("+url+")"; 
			storage.setItem('bgurl',url);
		}
	}*/
	//Функция преобразования времени формата "ЧЧ:ММ:СС" в UNIX
	function t2u(str) {
		str_splitted = str.split(":")
		return new Date().setHours(str_splitted[0], str_splitted[1], str_splitted[2])
	}
	//Функция преобразования времени формата UNIX в "ЧЧ:ММ:СС"
	function u2t(unix) {
		unix -= 3*60*60*1000
		return nTo0n(new Date(unix).getHours())+":"+nTo0n(new Date(unix).getMinutes())+":"+nTo0n(new Date(unix).getSeconds())
	}
	// Функция универсального показа/скрытия элемента
	function toggle_element_visibility(e) {
		e.style.transitionDuration = "0.5s"
		if (e.style.scale != '0') {
			e.style.scale  = '0'
			e.style.opacity  = '0'
			e.style.filter = "blur(10px)"
		}
		else if (e.style.scale != '1') {
			e.style.scale  = '1'
			e.style.opacity  = '1'
			e.style.filter = "blur(0px)"
		}
	}
	function toggle_element_visibility_from_hidden_state(e) {
		if (e.style.scale != '1') {
			e.style.scale  = '1'
			e.style.opacity  = '1'
		}
		else {
			e.style.scale  = '0'
			e.style.opacity  = '0'
		}
	}
	//Функции показа/скрытия окна смены группы 
	function showChangeGroup() {
		let popup = document.getElementsByClassName('popup')[0]
		toggle_element_visibility(popup)
	}
	//Функции показа/скрытия часов
	function clockToggle() {
		let clock = document.getElementsByClassName("clock-box")[0]
		toggle_element_visibility(clock)
	}
	//Функции показа/скрытия выбора фона
	function changeBG() {
		let styler = document.getElementById("styler")
		let colorchanger = document.getElementById("colorchanger")
		let clock = document.getElementsByClassName("clock-box")[0]
		
		if(colorchanger.style.scale != 0) {
			changeColor()
		}
		toggle_element_visibility_from_hidden_state(styler)
		clockToggle()
	}
	// 
	function changeColor() {
		let colorchanger = document.getElementById("colorchanger")
		let styler = document.getElementById("styler")
		let clock = document.getElementsByClassName("clock-box")[0]

		if(styler.style.scale != 0) {
			changeBG()
		}
		clockToggle()
		toggle_element_visibility_from_hidden_state(colorchanger)
	}
	//Целочисельное деление
	function div(val, by){
    		return (val - val % by) / by;
		}
    function isOdd(num) { return num % 2;}
	//Функция преобразования чисел формата "n" в "0n"
	function nTo0n(int){
    	if (int > 9) {
    		return int;
  		} else return `0${int}`;
	};
		
	// Основная функция часов, в начале из-за не стабильного API происходит получение отклонения времени несколько раз(нужно для точного отображения времени)
	function update() {
		if (document.getElementById("myspan").childNodes[0].textContent == "notdiff"){
			console.log("Fetching...")
			fetch("https://worldtimeapi.org/api/timezone/Asia/Almaty")
				.then(response => response.json())
				.then(data => {
			try	{
				console.log(diff)
			}
			catch {
				diff = new Date() - Date.parse(data.datetime.slice(0,-6))
				console.log("Апи говно "+diff)
				console.log("Текущая дата "+Date.parse(new Date())+new Date())
				console.log("Алматы "+Date.parse(data.datetime.slice(0,-6))+data.datetime)
				document.getElementById("myspan").innerHTML = diff
				document.body.style.cursor = "unset" 
			}
		})}
		let time_with_offset = new Date() - diff + debugoffset;
		
		var weekday = new Date().getDay()
		if (weekday == 0) {
			weekday = 7;
		}
		
		var pars = [l24,b24,l23,b23,l22,b22,l21,b21,l14,b14,l13,b13,l12,b12,l11,b11]
		var times_to_pars = [];
		var times_to_pars_type = [];
		var times_to_pars_unsorted = [];
		pars.forEach((element, index) => {
			// console.log(`Para ${element} | Index ${index} | Type ${index2para_type[index]}`)
			let dd = element-time_with_offset
			if(dd > 0){
				times_to_pars.push(dd)
				times_to_pars_type.push(index)
			}
			times_to_pars_unsorted.push(dd)
			// console.log(`${dd} ${u2t(dd)}`)
			document.title = u2t(dd)
		})
		timestr = "e"
		if(times_to_pars.length != 0){
			timestr = u2t(Math.min(...times_to_pars))
			//console.log(times_to_pars)
		}
		else {
			timestr = u2t(Math.min(...times_to_pars_unsorted))
		}
		lectures = document.getElementsByClassName('lecture')
		lecture_current_name = ''
		for(l=0;l<lectures.length;l++){
			if (div(15-Math.max(...times_to_pars_type),2) == l){
				lectures[l].style.color = "var(--accent-color)"
				lecture_current_name = lectures[l].innerText
			}
			else {
				lectures[l].style.color = "var(--text-color)"
			}
		}

        console.log( 1+div(16-Math.max(...times_to_pars_type),2) , "|" , (16-Math.max(...times_to_pars_type)) )
		if(!isOdd(Math.max(...times_to_pars_type))){
            document.getElementsByClassName("dopari")[0].innerText = "До конца пары"
        }
        else{
            document.getElementsByClassName("dopari")[0].innerText = "До начала пары"
        }
		// forEach end
		document.getElementById('clock').innerHTML = timestr
		document.title = `${timestr} | ${lecture_current_name}`
		times_to_pars = [];
		times_to_pars_unsorted = [];
		times_to_pars_type = [];
		//document.getElementsByClassName('lecture')[current_para].innerHTML = shedule[storage.getItem('group_id')][weekday].split(";")[current_para] + " <"
	}