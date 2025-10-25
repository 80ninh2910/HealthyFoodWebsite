/* Admin dashboard interactivity + charts */
document.addEventListener('DOMContentLoaded', async () => {
  // set year
  document.getElementById('year').textContent = new Date().getFullYear();

  // load sample data.json
  const data = await fetch('../json/admin_data.json').then(r => r.json()).catch(()=>null);

  // populate KPIs
  if (data) {
    document.getElementById('kpi-sales-val').textContent = data.kpis.sales;
    document.getElementById('kpi-orders-val').textContent = data.kpis.orders;
    document.getElementById('kpi-pending').textContent = data.kpis.pending;
    document.getElementById('kpi-cancel').textContent = data.kpis.cancelled;
    document.getElementById('kpi-users').textContent = data.kpis.activeUsers;
    // top products
    const ul = document.getElementById('top-products');
    data.topProducts.slice(0,6).forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `<img src="${p.img}" alt="${p.title}"><div>
        <strong>${p.title}</strong><div class="muted">${p.price}</div>
      </div>`;
      ul.appendChild(li);
    });

    // tx table
    const tbody = document.querySelector('#tx-table tbody');
    data.transactions.slice(0,10).forEach((t,i)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i+1}</td><td>#${t.id}</td><td>${t.date}</td><td>${statusBadge(t.status)}</td><td>${t.amount}</td>`;
      tbody.appendChild(tr);
    });

    // charts
    initLineChart(data.report);
    initBarChart(data.salesByCountry);
  }

  // segmented buttons
  document.querySelectorAll('.seg-btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      document.querySelectorAll('.seg-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      // TODO: change charts base on data period
    });
  });

  // theme toggle simple
  document.getElementById('theme-toggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    document.body.style.background = document.documentElement.classList.contains('dark') ? '#0f1720' : '';
  });

  // export placeholder
  document.getElementById('exportBtn').addEventListener('click', ()=> alert('Exporting CSV...'));

  // small helpers
  function statusBadge(s){
    const cls = s === 'Paid' ? 'paid' : s === 'Pending' ? 'pending' : 'cancelled';
    const color = cls === 'paid' ? 'green' : cls === 'pending' ? 'orange' : 'red';
    return `<span style="color:${color};font-weight:700">${s}</span>`;
  }

  // Chart: Line chart for weekly
  function initLineChart(report){
    const ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: report.labels,
        datasets: [{
          label: 'Sales',
          data: report.sales,
          fill: true,
          backgroundColor: createGradient(ctx, 'rgba(122,32,92,0.12)','rgba(122,32,92,0.02)'),
          borderColor: 'rgba(122,32,92,1)',
          tension: 0.35,
          pointRadius: 3,
        }]
      },
      options: {
        responsive:true,
        plugins:{legend:{display:false}},
        scales:{
          x:{grid:{display:false}},
          y:{grid:{color:'rgba(0,0,0,0.04)'}}
        }
      }
    });
  }

  // Chart: Bar chart sales by country
  function initBarChart(salesData){
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: salesData.map(d=>d.country),
        datasets: [{
          label: 'Sales',
          data: salesData.map(d=>d.sales),
          backgroundColor: salesData.map(d => d.color || 'rgba(122,32,92,0.9)'),
          borderRadius: 6
        }]
      },
      options:{plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{beginAtZero:true}}}
    });
  }

  function createGradient(ctx, c1, c2){
    const g = ctx.createLinearGradient(0,0,0,300);
    g.addColorStop(0,c1);
    g.addColorStop(1,c2);
    return g;
  }

});
