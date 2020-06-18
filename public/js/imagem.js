"use strict";

var processandoImagem = false;

function processarImagem(formData, name, arquivo, callback) {

	function erroImagem() {
		processandoImagem = false;
		alert("Ocorreu um erro durante o processamento da imagem :(");
	}

	processandoImagem = true;

	function terminarImagem(src) {
		var image = new Image();
		image.onload = function () {
			var w = image.width, h = image.height, cw = w, ch = h, cortar = true, bordas = false;

			// Inicialmente ajusta o tamanho do canvas com base
			// no aspect ratio desejado, caso exista algum
			var aspectratio = "16:9";
			if (aspectratio) {
				var rw = aspectratio.split(":"), rh;
				if (rw.length === 2 &&
					!isNaN(rh = parseInt(rw[1])) &&
					!isNaN(rw = parseInt(rw[0])) &&
					rh > 0 &&
					rw > 0) {
					if (Math.abs((cw / ch) - (rw / rh)) > 0.07) {
						bordas = true;
						// Preserva a maior dimensão
						if ((cw / rw) >= (ch / rh))
							ch = (cw * rh) / rw;
						else
							cw = (ch * rw) / rh;
					}
				}
			}

			// Não podemos ter imagens muito grandes
			if (cw >= ch) {
				if (cw > 1000) {
					ch = ch * (1000 / cw);
					cw = 1000;
				}
			} else {
				if (ch > 1000) {
					cw = cw * (1000 / ch);
					ch = 1000;
				}
			}

			cw = (cw + 0.5) | 0;
			ch = (ch + 0.5) | 0;

			var canvas = document.createElement("canvas");
			canvas.width = cw;
			canvas.height = ch;

			var context = canvas.getContext("2d", { alpha: false });

			try {
				if (("imageSmoothingEnabled" in context))
					context.imageSmoothingEnabled = true;
				if (("imageSmoothingQuality" in context))
					context.imageSmoothingQuality = "high";
			} catch (ex) {
				// Apenas ignora...
			}

			if (bordas) {
				// Preenche o fundo de preto (as novas bordas da imagem)
				context.fillStyle = "#000";
				context.fillRect(0, 0, cw, ch);

				if (!cortar) {
					// Redimensiona e centraliza a imagem dentro do canvas
					if ((cw / ch) > (w / h)) {
						// Bordas verticais nas laterais
						w = (((w * ch) / h) + 0.5) | 0;
						h = ch;
					} else {
						// Bordas horizontais acima e abaixo
						h = (((h * cw) / w) + 0.5) | 0;
						w = cw;
					}
				} else {
					// Amplia cortando o excesso
					if ((cw / ch) > (w / h)) {
						// Corta a parte superior e inferior da imagem
						h = (((h * cw) / w) + 0.5) | 0;
						w = cw;
					} else {
						// Corta as laterais da imagem
						w = (((w * ch) / h) + 0.5) | 0;
						h = ch;
					}
				}

				context.drawImage(image, 0, 0, image.width, image.height, (cw - w) >> 1, (ch - h) >> 1, w, h);
			} else {
				// Apenas redimensiona (não precisa de bordas)
				context.drawImage(image, 0, 0, cw, ch);
			}

			var mime = "image/jpeg";

			if (!HTMLCanvasElement.prototype.toBlob) {
				var data = canvas.toDataURL(mime, 0.89);

				// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas#JavaScript
				var binStr = atob(data.split(",")[1]),
					len = binStr.length,
					arr = new Uint8Array(len);
				for (var i = 0; i < len; i++)
					arr[i] = binStr.charCodeAt(i);

				formData.append(name, new Blob([arr], { type: mime }));
				processandoImagem = false;
				callback();
			} else {
				canvas.toBlob(function (blob) {
					formData.append(name, blob);
					processandoImagem = false;
					callback(true);
				}, mime, 0.89);
			}
		};
		image.onerror = erroImagem;
		image.src = src;
	}

	var reader = new FileReader();
	reader.onload = function () {
		terminarImagem(reader.result);
	};
	reader.onerror = erroImagem;
	reader.readAsDataURL(arquivo);
}
