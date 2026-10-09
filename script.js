const products = [
      {id:1,model:"Air Jordan 1",name:"Retro High OG · Chicago",price:1899,tag:"Ícone",image:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=850&q=82",alt:"Tênis de cano alto em tons claros",sizes:[38,39,40,41,42,43]},
      {id:2,model:"Air Jordan 4",name:"Retro · Cement Grey",price:2149,tag:"Seleção",image:"https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=850&q=82",alt:"Tênis esportivo em destaque",sizes:[39,40,41,42,43,44]},
      {id:3,model:"Air Jordan 11",name:"Retro · Midnight Navy",price:1749,oldPrice:1999,tag:"Edição",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=850&q=82",alt:"Tênis esportivo vermelho",sizes:[38,39,40,41,42,43]},
      {id:4,model:"Air Jordan 1",name:"Low OG · Neutral Grey",price:1349,tag:"Novo",image:"https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=850&q=82",alt:"Tênis casual em tons neutros",sizes:[38,39,40,41,42,44]},
      {id:5,model:"Air Jordan 4",name:"Retro · Craft Olive",price:1999,tag:"Curadoria",image:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=850&q=82",alt:"Tênis de estilo urbano",sizes:[39,40,41,42,43]},
      {id:6,model:"Air Jordan 11",name:"Retro · Cool Grey",price:1699,tag:"Clássico",image:"https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=850&q=82",alt:"Tênis esportivo de perfil lateral",sizes:[38,40,41,42,43,44]},
      {id:7,model:"Air Jordan 1",name:"High OG · University Blue",price:1849,tag:"Em destaque",image:"https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=850&q=82",alt:"Tênis de cano alto em tons azuis",sizes:[38,39,40,41,42,43]},
      {id:8,model:"Air Jordan 4",name:"Retro · Fire Red",price:2049,tag:"Seleção",image:"https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=850&q=82",alt:"Tênis esportivo com design robusto",sizes:[39,40,41,42,43,44]}
    ];
    const cart=[];
    let activeProduct=null;
    let selectedSize=null;
    let toastTimer=null;
    const money=value=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(value);
    const $=selector=>document.querySelector(selector);
    const grid=$("#productGrid");
    function renderProducts(){
      const query=$("#productSearch").value.trim().toLocaleLowerCase("pt-BR");
      const model=$("#modelFilter").value;
      const size=$("#sizeFilter").value;
      const maxPrice=Number($("#priceFilter").value)||Infinity;
      const sort=$("#sortFilter").value;
      let result=products.filter(product=>(!query||(product.name+" "+product.model).toLocaleLowerCase("pt-BR").includes(query))&&(!model||product.model===model)&&(!size||product.sizes.includes(Number(size)))&&product.price<=maxPrice);
      if(sort==="low")result.sort((a,b)=>a.price-b.price);
      if(sort==="high")result.sort((a,b)=>b.price-a.price);
      if(sort==="newest")result.sort((a,b)=>b.id-a.id);
      grid.innerHTML=result.map(product=>`<article class="product-card">
        <div class="product-image" data-open-product="${product.id}" tabindex="0" role="button" aria-label="Ver ${product.model} ${product.name}">
          <img loading="lazy" src="${product.image}" alt="${product.alt}">
          <span class="product-tag">${product.tag}</span>
          <span class="quick-add">Ver produto +</span>
        </div>
        <div class="product-info"><h3 class="product-model">${product.model}</h3><p class="product-name">${product.name}</p><div class="product-price">${product.oldPrice?`<s>${money(product.oldPrice)}</s>`:""}${money(product.price)}</div></div>
      </article>`).join("");
      $("#noResults").style.display=result.length?"none":"block";
    }
    function notify(message){
      const toast=$("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
    }
    function openModal(id,content){
      const modal=$(id);modal.innerHTML=content;modal.classList.add("open");document.body.style.overflow="hidden";
    }
    function closeModal(id){$(id).classList.remove("open");if(!$(".drawer.open")&&!$(".modal-wrap.open"))document.body.style.overflow=""}
    function openProduct(id){
      activeProduct=products.find(product=>product.id===Number(id));selectedSize=null;
      if(!activeProduct)return;
      openModal("#productModal",`<div class="modal"><button class="icon-button modal-close" aria-label="Fechar detalhes"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg></button><div class="product-modal-content">
        <img src="${activeProduct.image}" alt="${activeProduct.alt}">
        <div class="modal-info"><span class="eyebrow">${activeProduct.tag} · Curadoria independente</span><h2>${activeProduct.model}</h2><p class="model-sub">${activeProduct.name}</p><div class="modal-price">${money(activeProduct.price)}</div>
        <p>Uma silhueta marcante para compor seu estilo. Imagem, nome e especificações são ilustrativos e devem ser confirmados pela loja antes da compra.</p>
        <div class="size-heading"><span>Numeração BR</span><button type="button" id="sizeGuideButton">Guia de medidas</button></div>
        <div class="size-grid">${activeProduct.sizes.map(size=>`<button type="button" class="size-option" data-size="${size}">${size}</button>`).join("")}</div>
        <button class="button" id="addToCartButton">Adicionar à sacola</button>
        <div class="size-guide" id="sizeGuide">Consulte a tabela oficial de medidas do fabricante e confirme a disponibilidade deste tamanho diretamente com a loja. As opções exibidas são demonstrativas.</div>
        </div></div></div>`);
      $("#sizeGuide").hidden=true;
    }
    function openCart(){ $("#overlay").classList.add("open");$("#cartDrawer").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";renderCart()}
    function closeCart(){ $("#overlay").classList.remove("open");$("#cartDrawer").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");if(!$(".modal-wrap.open"))document.body.style.overflow=""}
    function renderCart(){
      const count=cart.reduce((sum,item)=>sum+item.quantity,0);
      $("#cartCount").textContent=count;$("#cartTitleCount").textContent=`(${count})`;
      $("#cartItems").innerHTML=count?cart.map((item,index)=>`<div class="cart-item"><img src="${item.product.image}" alt="${item.product.alt}"><div><h3>${item.product.model}</h3><p>${item.product.name} · Tam. ${item.size}</p><span class="item-price">${money(item.product.price)}</span><div class="quantity"><button data-quantity="${index}" data-delta="-1" aria-label="Diminuir quantidade">−</button><span>${item.quantity}</span><button data-quantity="${index}" data-delta="1" aria-label="Aumentar quantidade">+</button><button class="remove-item" data-remove="${index}">Remover</button></div></div></div>`).join(""):`<div class="empty-cart">Sua sacola está vazia.<br>Encontre seu próximo clássico.</div>`;
      $("#cartSubtotal").textContent=money(cart.reduce((sum,item)=>sum+item.product.price*item.quantity,0));
      $("#checkoutButton").disabled=!count;
      $("#checkoutButton").style.opacity=count?"1":".5";
    }
    function addToCart(){
      if(!selectedSize){notify("Escolha uma numeração para continuar.");return}
      const found=cart.find(item=>item.product.id===activeProduct.id&&item.size===selectedSize);
      if(found)found.quantity++;else cart.push({product:activeProduct,size:selectedSize,quantity:1});
      closeModal("#productModal");renderCart();notify("Adicionado à sua sacola.");openCart();
    }
    function openCheckout(){
      if(!cart.length)return;
      const total=cart.reduce((sum,item)=>sum+item.product.price*item.quantity,0);
      closeCart();
      openModal("#checkoutModal",`<div class="modal"><button class="icon-button modal-close" aria-label="Fechar checkout"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg></button><div class="checkout-content"><span class="eyebrow">Etapa demonstrativa</span><h2>Quase lá.</h2><p>Este checkout é apenas uma demonstração de interface. Não informe dados reais: não há processamento de pedido ou pagamento.</p>
        <form id="checkoutForm"><div class="checkout-grid">
        <label>Nome<input name="name" autocomplete="name" required placeholder="Seu nome"></label>
        <label>E-mail<input name="email" type="email" autocomplete="email" required placeholder="voce@email.com"></label>
        <label class="full">CEP<input name="cep" inputmode="numeric" maxlength="9" placeholder="00000-000"></label>
        </div><div class="checkout-summary"><span>Resumo demonstrativo (${cart.reduce((sum,item)=>sum+item.quantity,0)} item(ns))</span><strong>${money(total)}</strong></div><button class="button" type="submit">Finalizar demonstração</button></form>
        <p class="checkout-safe">Sem cobrança · Sem pedido · Nenhum dado enviado ou armazenado</p></div></div>`);
    }
    grid.addEventListener("click",event=>{const trigger=event.target.closest("[data-open-product]");if(trigger)openProduct(trigger.dataset.openProduct)});
    grid.addEventListener("keydown",event=>{if((event.key==="Enter"||event.key===" ")&&event.target.matches("[data-open-product]")){event.preventDefault();openProduct(event.target.dataset.openProduct)}});
    ["productSearch","modelFilter","sizeFilter","priceFilter","sortFilter"].forEach(id=>$("#"+id).addEventListener(id==="productSearch"?"input":"change",renderProducts));
    document.querySelectorAll(".category-card").forEach(card=>card.addEventListener("click",()=>{const category=card.dataset.category;if(category)$("#modelFilter").value=category;else $("#modelFilter").value="";renderProducts()}));
    $("#searchButton").addEventListener("click",()=>{$("#productSearch").focus();$("#productSearch").scrollIntoView({behavior:"smooth",block:"center"})});
    $("#cartButton").addEventListener("click",openCart);
    $("#overlay").addEventListener("click",closeCart);
    document.querySelector(".close-panel").addEventListener("click",closeCart);
    $("#menuButton").addEventListener("click",()=>{const nav=$("#mainNav");const open=nav.classList.toggle("open");$("#menuButton").setAttribute("aria-expanded",String(open))});
    $("#mainNav").addEventListener("click",event=>{if(event.target.closest("a")){$("#mainNav").classList.remove("open");$("#menuButton").setAttribute("aria-expanded","false")}});
    document.addEventListener("click",event=>{
      if(event.target.closest(".modal-close")){closeModal("#productModal");closeModal("#checkoutModal")}
      const size=event.target.closest("[data-size]");if(size){selectedSize=Number(size.dataset.size);document.querySelectorAll(".size-option").forEach(option=>option.classList.toggle("selected",option===size))}
      if(event.target.id==="addToCartButton")addToCart();
      if(event.target.id==="sizeGuideButton")$("#sizeGuide").hidden=!$("#sizeGuide").hidden;
      const quantity=event.target.closest("[data-quantity]");if(quantity){const item=cart[Number(quantity.dataset.quantity)];item.quantity+=Number(quantity.dataset.delta);if(item.quantity<1)cart.splice(Number(quantity.dataset.quantity),1);renderCart()}
      const remove=event.target.closest("[data-remove]");if(remove){cart.splice(Number(remove.dataset.remove),1);renderCart()}
    });
    $("#checkoutButton").addEventListener("click",openCheckout);
    $("#productModal").addEventListener("click",event=>{if(event.target===$("#productModal"))closeModal("#productModal")});
    $("#checkoutModal").addEventListener("click",event=>{if(event.target===$("#checkoutModal"))closeModal("#checkoutModal")});
    document.addEventListener("keydown",event=>{if(event.key==="Escape"){closeCart();closeModal("#productModal");closeModal("#checkoutModal")}});
    $("#freightForm").addEventListener("submit",event=>{event.preventDefault();const cep=$("#postalCode").value.replace(/\D/g,"");if(cep.length!==8){$("#freightResult").textContent="Digite um CEP válido com 8 números.";return}$("#freightResult").textContent="Simulação: entrega estimada de 3 a 7 dias úteis · R$ 19,90. Confirme prazo e valor com a loja.";});
    $("#postalCode").addEventListener("input",event=>{const digits=event.target.value.replace(/\D/g,"").slice(0,8);event.target.value=digits.length>5?digits.slice(0,5)+"-"+digits.slice(5):digits});
    $("#checkoutModal").addEventListener("submit",event=>{if(event.target.id==="checkoutForm"){event.preventDefault();closeModal("#checkoutModal");notify("Demonstração concluída. Nenhum pedido foi enviado.")}});
    $("#newsletterForm").addEventListener("submit",event=>{event.preventDefault();event.target.reset();notify("Cadastro demonstrativo recebido. Nenhum dado foi enviado.")});
    renderProducts();renderCart();
