﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Models;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RestaurantAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly RestaurantDbContext _context;
        public OrderController(RestaurantDbContext context)
        {
            _context = context;
        }

        // GET: api/<Order>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderMaster>>> GetOrderMasters()
        {
            return await _context.OrderMasters
                .Include(x => x.Customer)
                .ToListAsync();
        }

        // GET api/<Order>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderMaster>> GetOrderMaster(long id)
        {
            var orderDetails = await (from master in _context.Set<OrderMaster>()
                                      join detail in _context.Set<OrderDetail>()
                                      on master.OrderMasterId equals detail.OrderMasterId
                                      join foodItem in _context.Set<FoodItem>()
                                      on detail.FoodItemId equals foodItem.FoodItemId
                                      where master.OrderMasterId==id

                                      select new
                                      {
                                          master.OrderMasterId,
                                          detail.OrderDetailId,
                                          detail.FoodItemId,
                                          detail.Quantity,
                                          detail.FoodItemPrice,
                                          foodItem.FoodItemName
                                      }
                                      ).ToListAsync();
            var orderMaster = await (from a in _context.Set<OrderMaster>()
                                     where a.OrderMasterId == id

                                     select new
                                     {
                                         a.OrderMasterId,
                                         a.OrderNumber,
                                         a.CustomerId,
                                         a.PMethod,
                                         a.GTotal,
                                         deletedOrderItemIds = "",
                                         orderDetails = orderDetails
                                     }).FirstOrDefaultAsync();

            if (orderMaster == null)
            {
                return NotFound();
            }

            return Ok(orderMaster);
        }

        // POST api/<Order>
        [HttpPost]
        public async Task<ActionResult<OrderMaster>> PostOrderMaster(OrderMaster orderMaster)
        {
            _context.OrderMasters.Add(orderMaster);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrderMaster", new { id = orderMaster.OrderMasterId }, orderMaster);
        }

        // PUT api/<Order>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderMaster(long id,OrderMaster orderMaster)
        {
            if (id != orderMaster.OrderMasterId)
            {
                return BadRequest();
            }
            _context.Entry(orderMaster).State= EntityState.Modified;
            foreach(OrderDetail item in orderMaster.OrderDetails)
            {
                if (item.OrderDetailId == 0)
                {
                    _context.OrderDetails.Add(item);
                }
                else
                {
                    _context.Entry(item).State= EntityState.Modified;
                }
            }
            foreach (var i in orderMaster.DeletedOrderItemIds.Split(',').Where(x => x != ""))
            {
                OrderDetail y = _context.OrderDetails.Find(Convert.ToInt64(i));
                _context.OrderDetails.Remove(y);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderMasterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();

        }

        // DELETE api/<Order>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderMaster(long id)
        {
            var orderMaster = await _context.OrderMasters.FindAsync(id);
            if (orderMaster == null)
            {
                return NotFound();
            }
            _context.OrderMasters.Remove(orderMaster);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool OrderMasterExists(long id)
        {
            return _context.OrderMasters.Any(e => e.OrderMasterId == id);
        }
    }
}
